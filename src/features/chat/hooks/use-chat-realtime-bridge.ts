import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import {
  CHAT_LIST_QUERY_KEY,
  CHAT_SEEN_MESSAGE_CACHE_LIMIT,
  CHAT_SOCKET_EVENTS,
  CHAT_UNREAD_QUERY_KEY,
  getChatPath,
  isChatPath,
} from '../constants/chat.constants';
import type { ConversationSummary, LastMessage, UnreadSummary } from '../types/chat.dto';
import type { Paginated } from '@/types/api';
import { isSendMessageEvent } from '../utils/chat-message.guard';

export const useChatRealtimeBridge = () => {
  const { socket, status } = useSocket();
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('chat');
  const seenMessageIds = useRef(new Set<string>());

  useEffect(() => {
    if (status !== 'connected') return;
    void queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
  }, [queryClient, status]);

  useEffect(() => {
    const syncOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      void queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
    };
    document.addEventListener('visibilitychange', syncOnReturn);
    return () => document.removeEventListener('visibilitychange', syncOnReturn);
  }, [queryClient]);

  useEffect(() => {
    if (!socket || !user || (role !== Role.LANDLORD && role !== Role.TENANT)) return;
    const onMessage = (payload: unknown) => {
      if (!isSendMessageEvent(payload) || seenMessageIds.current.has(payload.messageId)) return;
      seenMessageIds.current.add(payload.messageId);
      if (seenMessageIds.current.size > CHAT_SEEN_MESSAGE_CACHE_LIMIT) {
        const oldestMessageId = seenMessageIds.current.values().next().value;
        if (oldestMessageId) seenMessageIds.current.delete(oldestMessageId);
      }
      const incoming = payload.senderUserId !== user.id;
      const lastMessage: LastMessage = {
        id: payload.messageId,
        sequence: payload.sequence,
        senderName: payload.senderName,
        contentPreview: payload.contentPreview,
        type: payload.type,
        sentAt: payload.createdAt,
        payload: null,
      };
      const cachedLists = queryClient.getQueriesData<InfiniteData<Paginated<ConversationSummary>>>({
        queryKey: CHAT_LIST_QUERY_KEY,
      });
      const missingLists = cachedLists.filter(
        ([, data]) => data && !data.pages.some((page) => page.items.some((item) => item.id === payload.conversationId)),
      );
      queryClient.setQueriesData<InfiniteData<Paginated<ConversationSummary>>>(
        { queryKey: CHAT_LIST_QUERY_KEY },
        (current) => {
          if (!current) return current;
          const items = current.pages.flatMap((page) => page.items);
          const index = items.findIndex((item) => item.id === payload.conversationId);
          if (index < 0) return current;
          const previous = items[index];
          const isLatest = !previous.lastMessage || BigInt(payload.sequence) >= BigInt(previous.lastMessage.sequence);
          const updated = {
            ...previous,
            displayName: payload.conversationName ?? previous.displayName,
            lastMessage: isLatest ? lastMessage : previous.lastMessage,
            unreadCount: previous.unreadCount + (incoming ? 1 : 0),
          };
          if (isLatest) {
            items.splice(index, 1);
            items.unshift(updated);
          } else {
            items[index] = updated;
          }
          let offset = 0;
          const pages = current.pages.map((page) => {
            const pageItems = items.slice(offset, offset + page.pagination.pageSize);
            offset += page.pagination.pageSize;
            return { ...page, items: pageItems };
          });
          return { ...current, pages };
        },
      );
      for (const [queryKey] of missingLists) {
        void queryClient.invalidateQueries({ queryKey, exact: true });
      }
      if (incoming) {
        const unread = queryClient.getQueryData<UnreadSummary>(CHAT_UNREAD_QUERY_KEY);
        if (unread)
          queryClient.setQueryData<UnreadSummary>(CHAT_UNREAD_QUERY_KEY, {
            totalUnreadCount: unread.totalUnreadCount + 1,
          });
        else void queryClient.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
      }
      if (!incoming || document.visibilityState !== 'visible') return;
      if (location.pathname === getChatPath(payload.conversationId)) return;
      toast(payload.senderName, {
        description: t('toast.message', {
          conversation: payload.conversationName ?? t('title'),
          preview: payload.type === 'image' ? t('photoSent') : payload.contentPreview,
        }),
        action: {
          label: t('toast.open'),
          onClick: () =>
            navigate(
              getChatPath(
                payload.conversationId,
                isChatPath(location.pathname)
                  ? (new URLSearchParams(location.search).get('q') ?? undefined)
                  : undefined,
              ),
            ),
        },
      });
    };
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onMessage);
    return () => {
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, onMessage);
    };
  }, [location.pathname, location.search, navigate, queryClient, role, socket, t, user]);

  useEffect(() => {
    if (!socket) return;
    const syncUnread = () => {
      void queryClient.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    };
    socket.on(CHAT_SOCKET_EVENTS.READ_UPDATED, syncUnread);
    socket.on(CHAT_SOCKET_EVENTS.AVAILABLE, syncUnread);
    socket.on(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, syncUnread);
    return () => {
      socket.off(CHAT_SOCKET_EVENTS.READ_UPDATED, syncUnread);
      socket.off(CHAT_SOCKET_EVENTS.AVAILABLE, syncUnread);
      socket.off(CHAT_SOCKET_EVENTS.ACCESS_REVOKED, syncUnread);
    };
  }, [queryClient, socket]);
};
