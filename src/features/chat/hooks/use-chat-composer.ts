import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import {
  CHAT_LIST_QUERY_KEY,
  CHAT_SEND_TIMEOUT_MS,
  CHAT_UNREAD_QUERY_KEY,
  chatKeys,
} from '../constants/chat.constants';
import type { SentMessage } from '../types/chat.dto';
import { retryChatRequest } from '../utils/retry-chat-request';
import { logRealtimeDebug } from '@/features/realtime/utils/realtime-debug';

export interface PendingMessage {
  clientMessageId: string;
  content: string;
  status: 'sending' | 'failed';
  canRetry: boolean;
  createdAt: string;
}

const transientError = (error: unknown) =>
  isAxiosError(error) && (!error.response || error.response.status === 408 || error.response.status >= 500);
export const useChatComposer = (targetKey: string, recipientUserId?: string, conversationId?: string) => {
  const client = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [pendingByTarget, setPendingByTarget] = useState<Record<string, PendingMessage[]>>({});
  const [conversationByTarget, setConversationByTarget] = useState<Record<string, string>>({});
  const sendControllers = useRef(new Map<string, AbortController>());
  const draft = drafts[targetKey] ?? '';
  const pending = pendingByTarget[targetKey] ?? [];
  const setDraft = (value: string) => setDrafts((current) => ({ ...current, [targetKey]: value }));

  useEffect(
    () => () => {
      sendControllers.current.forEach((controller) => controller.abort());
      sendControllers.current.clear();
    },
    [],
  );

  const send = async (content: string, clientMessageId: string = crypto.randomUUID()) => {
    let activeConversationId = conversationId ?? conversationByTarget[targetKey];
    let requestStage: 'create-direct-conversation' | 'send-message' = 'send-message';
    const cleaned = content.trim();
    const controller = new AbortController();
    sendControllers.current.set(clientMessageId, controller);
    setDraft('');
    const entry: PendingMessage = {
      clientMessageId,
      content: cleaned,
      status: 'sending',
      canRetry: false,
      createdAt: new Date().toISOString(),
    };
    setPendingByTarget((current) => ({
      ...current,
      [targetKey]: [...(current[targetKey] ?? []).filter((item) => item.clientMessageId !== clientMessageId), entry],
    }));
    try {
      if (recipientUserId && !activeConversationId) {
        requestStage = 'create-direct-conversation';
        logRealtimeDebug('info', 'REST request started', { stage: requestStage });
        const created = await retryChatRequest(
          (signal) =>
            chatApi.createDirect({ kind: 'direct', recipientUserId }, { signal, timeout: CHAT_SEND_TIMEOUT_MS }),
          controller.signal,
        );
        activeConversationId = created.id;
        setConversationByTarget((current) => ({ ...current, [targetKey]: created.id }));
        logRealtimeDebug('info', 'REST request succeeded', { stage: requestStage, conversationId: created.id });
      }
      if (!activeConversationId) throw new Error('Conversation is required');
      const sendingConversationId = activeConversationId;
      requestStage = 'send-message';
      logRealtimeDebug('info', 'REST request started', { stage: requestStage, conversationId: sendingConversationId });
      const message: SentMessage = await retryChatRequest(
        (signal) =>
          chatApi.sendText(
            { conversationId: sendingConversationId, clientMessageId, type: 'text', content: cleaned },
            { signal, timeout: CHAT_SEND_TIMEOUT_MS, skipErrorToast: true, skipSuccessToast: true },
          ),
        controller.signal,
      );
      logRealtimeDebug('info', 'REST request succeeded', {
        stage: requestStage,
        conversationId: sendingConversationId,
        messageId: message.id,
      });
      setPendingByTarget((current) => ({
        ...current,
        [targetKey]: (current[targetKey] ?? []).filter((item) => item.clientMessageId !== clientMessageId),
      }));
      void Promise.allSettled([
        client.invalidateQueries({ queryKey: chatKeys.messages(sendingConversationId) }),
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
      });
      if (!controller.signal.aborted) {
        setPendingByTarget((current) => ({
          ...current,
          [targetKey]: (current[targetKey] ?? []).map((item) =>
            item.clientMessageId === clientMessageId
              ? { ...item, status: 'failed', canRetry: transientError(error) }
              : item,
          ),
        }));
      }
      throw error;
    } finally {
      if (sendControllers.current.get(clientMessageId) === controller) sendControllers.current.delete(clientMessageId);
    }
  };

  return { draft, setDraft, pending, send };
};
