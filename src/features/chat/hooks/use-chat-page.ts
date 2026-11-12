import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import { useDirectConversationQuery } from './use-chat-queries';
import { useChatComposer, type PendingMessage } from './use-chat-composer';
import { CHAT_SEARCH_MAX_LENGTH, getChatDraftKey, getChatPath } from '../constants/chat.constants';
import type { ConversationSummary } from '../types/chat.dto';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { validateMediaFile } from '@/features/media/utils/upload-media';
import { getApiErrorMessage } from '@/lib/api/api-messages';
import { useNotify } from '@/lib/notifications/use-notify';

export const useChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const { status } = useSocket();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recipient, setRecipient] = useState<{ id: string; name: string }>();
  const draftKeysByConversation = useRef<Record<string, string>>({});
  const search = (searchParams.get('q') ?? '').slice(0, CHAT_SEARCH_MAX_LENGTH);
  const directLookup = useDirectConversationQuery(recipient?.id);
  const directTargetKey = recipient ? `direct:${recipient.id}` : undefined;
  const targetKey = directTargetKey ?? (id ? (getChatDraftKey(location.state) ?? id) : 'new-chat');
  const activeTargetKey = useRef(targetKey);
  useLayoutEffect(() => {
    activeTargetKey.current = targetKey;
  }, [targetKey]);
  const composer = useChatComposer(targetKey, recipient?.id, id);

  useEffect(() => {
    const existing = directLookup.data?.items[0];
    if (!existing || !directTargetKey) return;
    draftKeysByConversation.current[existing.id] = directTargetKey;
    navigate(getChatPath(existing.id, search), {
      replace: true,
      state: { chatDraftKey: directTargetKey },
    });
  }, [directLookup.data, directTargetKey, navigate, search]);

  const rememberConversationDraftKey = (conversationId: string, key: string) => {
    if (!key.startsWith('direct:')) return;
    draftKeysByConversation.current[conversationId] = key;
  };

  const selectConversation = (conversation: ConversationSummary) => {
    const draftKey = draftKeysByConversation.current[conversation.id] ?? conversation.id;
    activeTargetKey.current = draftKey;
    navigate(getChatPath(conversation.id, search), { state: { chatDraftKey: draftKey } });
    setRecipient(undefined);
  };
  const selectDirect = (userId: string, name: string) => {
    activeTargetKey.current = `direct:${userId}`;
    setDialogOpen(false);
    setRecipient({ id: userId, name });
    navigate(getChatPath(undefined, search), { replace: true });
  };
  const send = async () => {
    const content = composer.draft.trim();
    if (!content && !composer.imageDraft) return;
    const sendingTarget = targetKey;
    try {
      const result = await composer.send(content, undefined, composer.imageDraft, undefined, composer.replyTo);
      rememberConversationDraftKey(result.conversationId, sendingTarget);
      if (result.conversationId && activeTargetKey.current === sendingTarget) {
        navigate(getChatPath(result.conversationId, search), { state: { chatDraftKey: sendingTarget } });
        setRecipient(undefined);
      }
    } catch {
      // The in-memory pending item is the visible send error state.
    }
  };
  const retry = async (item: PendingMessage) => {
    const sendingTarget = targetKey;
    try {
      const result = await composer.send(
        item.content,
        item.clientMessageId,
        item.imageFile,
        item.mediaId,
        item.replyTo,
      );
      rememberConversationDraftKey(result.conversationId, sendingTarget);
      if (result.conversationId && activeTargetKey.current === sendingTarget) {
        navigate(getChatPath(result.conversationId, search), { state: { chatDraftKey: sendingTarget } });
        setRecipient(undefined);
      }
    } catch {
      // Keep the failed item and its idempotency key for a later retry.
    }
  };
  const selectImage = (file?: File) => {
    if (!file) return;
    const errorCode = validateMediaFile(file, MediaPurpose.CHAT_ATTACHMENT);
    if (errorCode) {
      notify.error(getApiErrorMessage(errorCode));
      return;
    }
    composer.setImageDraft(file);
  };
  const changeSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };
  const openConversation = (conversationId: string) => {
    activeTargetKey.current = conversationId;
    setRecipient(undefined);
    navigate(getChatPath(conversationId, search), { state: { chatDraftKey: conversationId } });
  };
  const backToList = () => {
    activeTargetKey.current = 'new-chat';
    setRecipient(undefined);
    navigate(getChatPath(undefined, search));
  };

  return {
    id,
    search,
    dialogOpen,
    recipient: id ? undefined : recipient,
    connectionStatus: status,
    draft: composer.draft,
    pending: composer.pending,
    imageDraft: composer.imageDraft,
    replyTo: composer.replyTo,
    isSending: composer.pending.some((item) => item.status === 'sending' || item.status === 'uploading'),
    onSearchChange: changeSearch,
    onSelectConversation: selectConversation,
    onSelectDirect: selectDirect,
    onOpenDialog: () => setDialogOpen(true),
    onCloseDialog: () => setDialogOpen(false),
    onGroupCreated: openConversation,
    onDraftChange: composer.setDraft,
    onSend: () => void send(),
    onSelectImage: selectImage,
    onRemoveImage: () => composer.setImageDraft(undefined),
    onReply: composer.setReplyTo,
    onCancelReply: () => composer.setReplyTo(undefined),
    onRetry: (item: PendingMessage) => void retry(item),
    onBack: backToList,
  };
};
