import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { MediaUploadError } from '@/features/media/utils/upload-media';
import { MEDIA_ERROR_CODES } from '@/features/media/constants/media.constants';
import {
  CHAT_LIST_QUERY_KEY,
  CHAT_SEND_TIMEOUT_MS,
  CHAT_UNREAD_QUERY_KEY,
  chatKeys,
} from '../constants/chat.constants';
import type { ChatMessage, SentMessage } from '../types/chat.dto';
import type { SendMessageRequest } from '../types/chat.dto';
import { retryChatRequest } from '../utils/retry-chat-request';
import { upsertChatMessageCache } from '../utils/upsert-chat-message-cache';
import { logRealtimeDebug } from '@/features/realtime/utils/realtime-debug';
import { createUuid } from '@/lib/utils/uuid';
import { useAuthStore } from '@/stores/auth-store';

export interface PendingMessage {
  clientMessageId: string;
  content: string;
  type: 'text' | 'image';
  imageFile?: File;
  mediaId?: string;
  uploadProgress?: number;
  status: 'uploading' | 'sending' | 'failed';
  canRetry: boolean;
  createdAt: string;
}

const transientError = (error: unknown) =>
  (isAxiosError(error) && (!error.response || error.response.status === 408 || error.response.status >= 500)) ||
  (error instanceof MediaUploadError && error.code === MEDIA_ERROR_CODES.MEDIA_STORAGE_UPLOAD_FAILED);
export const useChatComposer = (targetKey: string, recipientUserId?: string, conversationId?: string) => {
  const client = useQueryClient();
  const senderUserId = useAuthStore((state) => state.user?.id);
  const mediaUpload = useMediaUpload();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [imageDrafts, setImageDrafts] = useState<Record<string, File>>({});
  const [pendingByTarget, setPendingByTarget] = useState<Record<string, PendingMessage[]>>({});
  const [conversationByTarget, setConversationByTarget] = useState<Record<string, string>>({});
  const sendControllers = useRef(new Map<string, AbortController>());
  const draft = drafts[targetKey] ?? '';
  const imageDraft = imageDrafts[targetKey];
  const pending = pendingByTarget[targetKey] ?? [];
  const setDraft = (value: string) => setDrafts((current) => ({ ...current, [targetKey]: value }));
  const setImageDraft = (file?: File) =>
    setImageDrafts((current) => {
      const next = { ...current };
      if (file) next[targetKey] = file;
      else delete next[targetKey];
      return next;
    });

  useEffect(
    () => () => {
      sendControllers.current.forEach((controller) => controller.abort());
      sendControllers.current.clear();
    },
    [],
  );

  const send = async (
    content: string,
    clientMessageId: string = createUuid(),
    imageFile?: File,
    existingMediaId?: string,
  ) => {
    if (!senderUserId) throw new Error('Authenticated user is required to send chat messages');
    let activeConversationId = conversationId ?? conversationByTarget[targetKey];
    let requestStage: 'create-direct-conversation' | 'upload-image' | 'send-message' = 'send-message';
    let requestStartedAt = performance.now();
    const cleaned = content.trim();
    const controller = new AbortController();
    sendControllers.current.set(clientMessageId, controller);
    setDraft('');
    const entry: PendingMessage = {
      clientMessageId,
      content: cleaned,
      type: imageFile ? 'image' : 'text',
      ...(imageFile ? { imageFile } : {}),
      ...(existingMediaId ? { mediaId: existingMediaId } : {}),
      uploadProgress: existingMediaId ? 100 : 0,
      status: 'sending',
      canRetry: false,
      createdAt: new Date().toISOString(),
    };
    setImageDraft(undefined);
    setPendingByTarget((current) => ({
      ...current,
      [targetKey]: [...(current[targetKey] ?? []).filter((item) => item.clientMessageId !== clientMessageId), entry],
    }));
    try {
      if (recipientUserId && !activeConversationId) {
        requestStage = 'create-direct-conversation';
        requestStartedAt = performance.now();
        logRealtimeDebug('info', 'REST request started', { stage: requestStage });
        const created = await retryChatRequest(
          (signal) =>
            chatApi.createDirect({ kind: 'direct', recipientUserId }, { signal, timeout: CHAT_SEND_TIMEOUT_MS }),
          controller.signal,
        );
        activeConversationId = created.id;
        setConversationByTarget((current) => ({ ...current, [targetKey]: created.id }));
        logRealtimeDebug('info', 'REST request succeeded', {
          stage: requestStage,
          conversationId: created.id,
          durationMs: Math.round(performance.now() - requestStartedAt),
        });
      }
      if (!activeConversationId) throw new Error('Conversation is required');
      const sendingConversationId = activeConversationId;
      let mediaId = existingMediaId;
      if (imageFile && !mediaId) {
        requestStage = 'upload-image';
        requestStartedAt = performance.now();
        setPendingByTarget((current) => ({
          ...current,
          [targetKey]: (current[targetKey] ?? []).map((item) =>
            item.clientMessageId === clientMessageId ? { ...item, status: 'uploading' } : item,
          ),
        }));
        const uploaded = await mediaUpload.uploadAsync({
          file: imageFile,
          ownerType: MediaOwnerType.CONVERSATION,
          ownerId: sendingConversationId,
          purpose: MediaPurpose.CHAT_ATTACHMENT,
          skipSuccessToast: true,
          skipErrorToast: true,
          onProgress: (uploadProgress) =>
            setPendingByTarget((current) => ({
              ...current,
              [targetKey]: (current[targetKey] ?? []).map((item) =>
                item.clientMessageId === clientMessageId ? { ...item, uploadProgress } : item,
              ),
            })),
        });
        mediaId = uploaded.id;
        setPendingByTarget((current) => ({
          ...current,
          [targetKey]: (current[targetKey] ?? []).map((item) =>
            item.clientMessageId === clientMessageId
              ? { ...item, mediaId, uploadProgress: 100, status: 'sending' }
              : item,
          ),
        }));
        logRealtimeDebug('info', 'REST media upload succeeded', {
          stage: requestStage,
          conversationId: sendingConversationId,
          durationMs: Math.round(performance.now() - requestStartedAt),
        });
      }
      let sendRequest: SendMessageRequest;
      if (imageFile) {
        if (!mediaId) throw new Error('Uploaded chat image is missing its media ID');
        sendRequest = {
          conversationId: sendingConversationId,
          clientMessageId,
          type: 'image',
          content: cleaned || null,
          mediaId,
        };
      } else {
        sendRequest = { conversationId: sendingConversationId, clientMessageId, type: 'text', content: cleaned };
      }
      requestStage = 'send-message';
      requestStartedAt = performance.now();
      logRealtimeDebug('info', 'REST request started', { stage: requestStage, conversationId: sendingConversationId });
      const message: SentMessage = await retryChatRequest(
        (signal) =>
          chatApi.sendMessage(sendRequest, {
            signal,
            timeout: CHAT_SEND_TIMEOUT_MS,
            skipErrorToast: true,
            skipSuccessToast: true,
          }),
        controller.signal,
      );
      logRealtimeDebug('info', 'REST request succeeded', {
        stage: requestStage,
        conversationId: sendingConversationId,
        messageId: message.id,
        durationMs: Math.round(performance.now() - requestStartedAt),
      });
      const sentMessage: ChatMessage = {
        id: message.id,
        conversationId: message.conversationId,
        senderUserId,
        senderName: message.senderName,
        senderType: 'user',
        sequence: message.sequence,
        clientMessageId: message.clientMessageId ?? clientMessageId,
        type: message.type,
        content: message.content,
        mediaId: message.mediaId,
        payload: null,
        createdAt: message.createdAt,
      };
      const messagesQueryKey = chatKeys.messages(sendingConversationId);
      const historyHadData = client.getQueryData(messagesQueryKey) !== undefined;
      const historyWasFetching = client.getQueryState(messagesQueryKey)?.fetchStatus === 'fetching';
      if (historyWasFetching) await client.cancelQueries({ queryKey: messagesQueryKey });
      upsertChatMessageCache(client, sentMessage);
      if (historyWasFetching || !historyHadData) void client.invalidateQueries({ queryKey: messagesQueryKey });
      setPendingByTarget((current) => ({
        ...current,
        [targetKey]: (current[targetKey] ?? []).filter((item) => item.clientMessageId !== clientMessageId),
      }));
      void Promise.allSettled([
        client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY }),
        client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY }),
      ]);
      return { conversationId: sendingConversationId, message };
    } catch (error) {
      const status = isAxiosError(error) ? (error.response?.status ?? null) : null;
      const responseCode =
        isAxiosError(error) &&
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'code' in error.response.data
          ? String(error.response.data.code)
          : null;
      logRealtimeDebug('warn', 'REST request failed', {
        stage: requestStage,
        conversationId: activeConversationId ?? null,
        status,
        code: responseCode,
        aborted: controller.signal.aborted,
        durationMs: Math.round(performance.now() - requestStartedAt),
      });
      if (!controller.signal.aborted) {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        const canRetry =
          transientError(error) || (requestStage === 'upload-image' && (status === 409 || status === 410));
        setPendingByTarget((current) => ({
          ...current,
          [targetKey]: (current[targetKey] ?? []).map((item) =>
            item.clientMessageId === clientMessageId ? { ...item, status: 'failed', canRetry } : item,
          ),
        }));
      }
      throw error;
    } finally {
      if (sendControllers.current.get(clientMessageId) === controller) sendControllers.current.delete(clientMessageId);
    }
  };

  return { draft, setDraft, imageDraft, setImageDraft, pending, send };
};
