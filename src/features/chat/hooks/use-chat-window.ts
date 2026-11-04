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
import type { ChatMessage } from '../types/chat.dto';
import { isConversationSocketEvent, parseChatMessage } from '../utils/chat-message.guard';

interface UseChatWindowOptions {
  conversationId?: string;
  draftName?: string;
  connectionStatus: SocketConnectionStatus;
}

export const useChatWindow = ({ conversationId, draftName, connectionStatus }: UseChatWindowOptions) => {
  const { socket } = useSocket();
  const userId = useAuthStore((state) => state.user?.id);
  const client = useQueryClient();
  const navigate = useNavigate();
  const atBottom = useRef(true);
  const lastReadRequest = useRef<string | undefined>(undefined);
  const seenMessageIds = useRef(new Set<string>());
  const detail = useConversationQuery(conversationId);
  const history = useMessagesQuery(conversationId);
  const { refetch: refetchDetail } = detail;
  const { refetch: refetchHistory } = history;
  const { mutate: markReadMessage } = useMarkReadMutation();
  const [newCount, setNewCount] = useState(0);
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
    if (!conversationId || !lastSequence || document.visibilityState !== 'visible' || !atBottom.current) return;
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
  }, [conversationId, currentMember, lastSequence, markReadMessage]);

  useEffect(() => {
    if (!socket || !conversationId) return;
    const joinConversation = () =>
      socket.emit(CHAT_SOCKET_EVENTS.JOIN, { conversationId }, (result: unknown) => {
        if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== false) return;
        if ('code' in result && result.code === 'FORBIDDEN') navigate(getChatPath());
      });
    joinConversation();
    const onMessage = (payload: unknown) => {
      const message = parseChatMessage(payload);
      if (!message || message.conversationId !== conversationId) return;
      const alreadySeen =
        seenMessageIds.current.has(message.id) ||
        Boolean(
          client
            .getQueryData<InfiniteData<CursorPaginated<ChatMessage>>>(chatKeys.messages(conversationId))
            ?.pages.some((page) => page.items.some((item) => item.id === message.id)),
        );
      if (alreadySeen) return;
      seenMessageIds.current.add(message.id);
      if (seenMessageIds.current.size > CHAT_SEEN_MESSAGE_CACHE_LIMIT) {
        const oldestId = seenMessageIds.current.values().next().value;
        if (oldestId) seenMessageIds.current.delete(oldestId);
      }
      if (message.senderUserId !== userId && message.type !== 'system') setNewCount((count) => count + 1);
      client.setQueryData<InfiniteData<CursorPaginated<ChatMessage>>>(chatKeys.messages(conversationId), (current) => {
        if (!current?.pages.length) return current;
        const [latest, ...older] = current.pages;
        return latest.items.some((item) => item.id === message.id)
          ? current
          : { ...current, pages: [{ ...latest, items: [message, ...latest.items] }, ...older] };
      });
      if (message.type === 'system') {
        void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
        void client.invalidateQueries({ queryKey: chatKeys.detail(conversationId) });
      }
    };
    const onRevoked = (event: unknown) => {
      if (!isConversationSocketEvent(event) || event.conversationId !== conversationId) return;
      client.removeQueries({ queryKey: chatKeys.detail(conversationId), exact: true });
      client.removeQueries({ queryKey: chatKeys.messages(conversationId), exact: true });
      void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      void client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
      navigate(getChatPath());
    };
    const onReadUpdated = (event: unknown) => {
      if (!isConversationSocketEvent(event)) return;
      if (event.conversationId === conversationId) {
        void client.invalidateQueries({ queryKey: chatKeys.detail(conversationId) });
        void client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
        void client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      }
    };
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, onMessage);
    socket.on(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, onRevoked);
    socket.on(CHAT_SOCKET_EVENTS.READ_UPDATED, onReadUpdated);
    socket.on(REALTIME_SOCKET_EVENTS.SESSION_READY, joinConversation);
    return () => {
      socket.emit(CHAT_SOCKET_EVENTS.LEAVE, { conversationId });
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, onMessage);
      socket.off(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, onRevoked);
      socket.off(CHAT_SOCKET_EVENTS.READ_UPDATED, onReadUpdated);
      socket.off(REALTIME_SOCKET_EVENTS.SESSION_READY, joinConversation);
    };
  }, [client, conversationId, navigate, socket, userId]);

  useEffect(() => {
    if (connectionStatus === 'connected' && conversationId) {
      void Promise.all([refetchDetail(), refetchHistory()]);
    }
  }, [connectionStatus, conversationId, refetchDetail, refetchHistory]);

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
    markLatestRead,
    setAtBottom: (value: boolean) => {
      atBottom.current = value;
    },
    retryLoad: () => void Promise.all([refetchDetail(), refetchHistory()]),
  };
};
