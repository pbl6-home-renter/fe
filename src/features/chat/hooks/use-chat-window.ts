import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';
import { useAuthStore } from '@/stores/auth-store';
import { REALTIME_SOCKET_EVENTS } from '@/features/realtime/constants/realtime.constants';
import {
  CHAT_LIST_QUERY_KEY,
  CHAT_SEEN_MESSAGE_CACHE_LIMIT,
  CHAT_SOCKET_EVENTS,
  CHAT_UNREAD_QUERY_KEY,
  getChatPath,
  chatKeys,
} from '../constants/chat.constants';
import { useConversationQuery, useMessagesQuery } from './use-chat-queries';
import { useMarkReadMutation } from './use-chat-mutations';
import type { CursorPaginated } from '@/types/api';
import type { ChatMessage, ConversationDetail } from '../types/chat.dto';
import {
  isConversationSocketEvent,
  isMemberReadEvent,
  isSendMessageEvent,
  parseChatMessage,
} from '../utils/chat-message.guard';
import { upsertChatMessageCache } from '../utils/upsert-chat-message-cache';
import { logRealtimeDebug } from '@/features/realtime/utils/realtime-debug';

interface UseChatWindowOptions {
  conversationId?: string;
  draftName?: string;
  connectionStatus: SocketConnectionStatus;
  maxSequence?: string;
  isContentCovered?: boolean;
}

export const useChatWindow = ({
  conversationId,
  draftName,
  connectionStatus,
  maxSequence,
  isContentCovered,
}: UseChatWindowOptions) => {
  const { socket } = useSocket();
  const userId = useAuthStore((state) => state.user?.id);
  const client = useQueryClient();
  const navigate = useNavigate();
  const atBottom = useRef(true);
  const setAtBottom = useCallback((value: boolean) => {
    atBottom.current = value;
  }, []);
  const lastReadRequest = useRef<string | undefined>(undefined);
  const seenMessageIds = useRef(new Set<string>());
  const countedMessageIds = useRef(new Set<string>());
  const detail = useConversationQuery(conversationId);
  const history = useMessagesQuery(conversationId, maxSequence);
  const { refetch: refetchDetail } = detail;
  const { refetch: refetchHistory } = history;
  const { mutate: markReadMessage } = useMarkReadMutation();
  const [newCount, setNewCount] = useState(0);
  const [liveMessageIds, setLiveMessageIds] = useState(() => new Set<string>());
  const messages = useMemo(() => history.data?.pages.flatMap((page) => page.items).reverse() ?? [], [history.data]);
  const lastSequence = messages.at(-1)?.sequence;
  const currentMember = detail.data?.members.find((member) => member.userId === userId);
  const title =
    draftName ??
    detail.data?.displayName ??
    detail.data?.title ??
    detail.data?.members.find((member) => member.userId !== userId)?.displayName ??
    '';

  const markLatestRead = useCallback(() => {
    if (
      !conversationId ||
      maxSequence ||
      isContentCovered ||
      !lastSequence ||
      document.visibilityState !== 'visible' ||
      !atBottom.current
    )
      return;
    setNewCount(0);
    const isUnread =
      currentMember?.status === 'active' &&
      lastSequence &&
      BigInt(lastSequence) > BigInt(currentMember.lastReadSequence);
    if (isUnread && lastReadRequest.current !== lastSequence) {
      lastReadRequest.current = lastSequence;
      markReadMessage(
        { conversationId, sequence: lastSequence },
        {
          onError: () => {
            lastReadRequest.current = undefined;
          },
        },
      );
      setNewCount(0);
    }
  }, [conversationId, currentMember, isContentCovered, lastSequence, markReadMessage, maxSequence]);

  useEffect(() => {
    if (!socket || !conversationId) return;
    const joinConversation = () => {
      logRealtimeDebug('info', 'emit conversation:join', { conversationId });
      socket.emit(CHAT_SOCKET_EVENTS.JOIN, { conversationId }, (result: unknown) => {
        logRealtimeDebug('info', 'ack conversation:join', {
          conversationId,
          ok: !(result && typeof result === 'object' && 'ok' in result && result.ok === false),
          code:
            result && typeof result === 'object' && 'code' in result && typeof result.code === 'string'
              ? result.code
              : null,
        });
        if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== false) return;
        if ('code' in result && result.code === 'FORBIDDEN') navigate(getChatPath());
      });
    };
    joinConversation();
    const onMessage = (payload: unknown) => {
      const message = parseChatMessage(payload);
      logRealtimeDebug(message ? 'info' : 'warn', 'receive message:created', {
        valid: Boolean(message),
        conversationId: message?.conversationId ?? null,
        messageId: message?.id ?? null,
      });
      if (!message || message.conversationId !== conversationId) return;
      const messagesQueryKey = chatKeys.messages(conversationId);
      const cachedMessages = client.getQueryData<InfiniteData<CursorPaginated<ChatMessage>>>(messagesQueryKey);
      const alreadySeen =
        seenMessageIds.current.has(message.id) ||
        Boolean(cachedMessages?.pages.some((page) => page.items.some((item) => item.id === message.id)));
      if (message.senderUserId !== userId && message.type !== 'system' && !countedMessageIds.current.has(message.id)) {
        rememberMessageId(countedMessageIds.current, message.id);
        setNewCount((count) => count + 1);
      }
      if (alreadySeen) return;
      setLiveMessageIds((current) => {
        const next = new Set(current);
        rememberMessageId(next, message.id);
        return next;
      });
      rememberMessageId(seenMessageIds.current, message.id);
      const historyHadData = client.getQueryData(messagesQueryKey) !== undefined;
      const historyWasFetching = client.getQueryState(messagesQueryKey)?.fetchStatus === 'fetching';
      if (historyWasFetching) {
        void client.cancelQueries({ queryKey: messagesQueryKey }).then(() => {
          upsertChatMessageCache(client, message);
          void client.invalidateQueries({ queryKey: messagesQueryKey });
        });
      } else {
        upsertChatMessageCache(client, message);
        if (!historyHadData) void client.invalidateQueries({ queryKey: messagesQueryKey });
      }
      if (message.type === 'system') {
        void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
        void client.invalidateQueries({ queryKey: chatKeys.detail(conversationId) });
      }
    };
    const onMessageReceived = (payload: unknown) => {
      if (!isSendMessageEvent(payload) || payload.conversationId !== conversationId) return;
      const messagesQueryKey = chatKeys.messages(conversationId);
      const cachedMessages = client.getQueryData<InfiniteData<CursorPaginated<ChatMessage>>>(messagesQueryKey);
      const messageIsCached = Boolean(
        cachedMessages?.pages.some((page) => page.items.some((item) => item.id === payload.messageId)),
      );
      logRealtimeDebug('info', 'receive chat:message-received in active conversation', {
        conversationId,
        messageId: payload.messageId,
        messageIsCached,
      });
      if (payload.senderUserId !== userId && !countedMessageIds.current.has(payload.messageId)) {
        rememberMessageId(countedMessageIds.current, payload.messageId);
        setNewCount((count) => count + 1);
      }
      if (seenMessageIds.current.has(payload.messageId) || messageIsCached) return;
      setLiveMessageIds((current) => {
        const next = new Set(current);
        rememberMessageId(next, payload.messageId);
        return next;
      });
      logRealtimeDebug('warn', 'active conversation message missing; refreshing history', {
        conversationId,
        messageId: payload.messageId,
      });
      void client.invalidateQueries({ queryKey: messagesQueryKey });
    };
    const onRevoked = (event: unknown) => {
      logRealtimeDebug('info', 'receive conversation:access-revoked', { conversationId });
      if (!isConversationSocketEvent(event) || event.conversationId !== conversationId) return;
      client.removeQueries({ queryKey: chatKeys.detail(conversationId), exact: true });
      client.removeQueries({ queryKey: chatKeys.messageHistory(conversationId) });
      void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      void client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
      navigate(getChatPath());
    };
    const onReadUpdated = (event: unknown) => {
      logRealtimeDebug('info', 'receive conversation:read-updated', { conversationId });
      if (!isConversationSocketEvent(event)) return;
      if (event.conversationId === conversationId) {
        void client.invalidateQueries({ queryKey: chatKeys.detail(conversationId) });
        void client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
        void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      }
    };
    const onMemberRead = (event: unknown) => {
      if (!isMemberReadEvent(event) || event.conversationId !== conversationId) return;
      client.setQueryData<ConversationDetail>(chatKeys.detail(conversationId), (current) => {
        if (!current) return current;
        return {
          ...current,
          members: current.members.map((member) =>
            member.userId === event.userId && BigInt(event.lastReadSequence) > BigInt(member.lastReadSequence)
              ? { ...member, lastReadSequence: event.lastReadSequence }
              : member,
          ),
        };
      });
    };
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, onMessage);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onMessageReceived);
    socket.on(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, onRevoked);
    socket.on(CHAT_SOCKET_EVENTS.READ_UPDATED, onReadUpdated);
    socket.on(CHAT_SOCKET_EVENTS.MEMBER_READ, onMemberRead);
    socket.on(REALTIME_SOCKET_EVENTS.SESSION_READY, joinConversation);
    return () => {
      logRealtimeDebug('info', 'emit conversation:leave', { conversationId });
      socket.emit(CHAT_SOCKET_EVENTS.LEAVE, { conversationId });
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, onMessage);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onMessageReceived);
      socket.off(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, onRevoked);
      socket.off(CHAT_SOCKET_EVENTS.READ_UPDATED, onReadUpdated);
      socket.off(CHAT_SOCKET_EVENTS.MEMBER_READ, onMemberRead);
      socket.off(REALTIME_SOCKET_EVENTS.SESSION_READY, joinConversation);
    };
  }, [client, conversationId, navigate, socket, userId]);

  useEffect(() => {
    if (connectionStatus === 'connected' && conversationId) {
      void client.invalidateQueries({ queryKey: chatKeys.messages(conversationId), exact: true });
      void Promise.all([refetchDetail(), refetchHistory()]);
    }
  }, [client, connectionStatus, conversationId, refetchDetail, refetchHistory]);

  useEffect(() => {
    const syncReadState = () => {
      if (document.visibilityState === 'visible' && atBottom.current) markLatestRead();
    };
    document.addEventListener('visibilitychange', syncReadState);
    window.addEventListener('online', syncReadState);
    return () => {
      document.removeEventListener('visibilitychange', syncReadState);
      window.removeEventListener('online', syncReadState);
    };
  }, [markLatestRead]);

  return {
    detail,
    history,
    messages,
    title,
    currentMember,
    lastSequence,
    newCount,
    liveMessageIds,
    currentUserId: userId,
    markLatestRead,
    setAtBottom,
    hasNewer: Boolean(history.hasPreviousPage),
    isLoadingNewer: history.isFetchingPreviousPage,
    loadNewer: () => void history.fetchPreviousPage(),
    retryLoad: () => void Promise.all([refetchDetail(), refetchHistory()]),
  };
};

const rememberMessageId = (messageIds: Set<string>, messageId: string) => {
  messageIds.add(messageId);
  if (messageIds.size > CHAT_SEEN_MESSAGE_CACHE_LIMIT) {
    const oldestMessageId = messageIds.values().next().value;
    if (oldestMessageId) messageIds.delete(oldestMessageId);
  }
};
