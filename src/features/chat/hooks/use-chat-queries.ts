import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CHAT_UNREAD_QUERY_KEY, chatKeys } from '../constants/chat.constants';
import { chatApi } from '../api/chat.api';
import type { InfiniteQueryHookOptions, QueryHookOptions } from '@/lib/query/types';
import type { ConversationDetail, ConversationSummary, MessagePage, UnreadSummary } from '../types/chat.dto';
import type { Paginated } from '@/types/api';

export const useConversationQuery = (id?: string, options?: QueryHookOptions<ConversationDetail>) =>
  useQuery({
    queryKey: id ? chatKeys.detail(id) : ['chat', 'conversation', 'disabled'],
    queryFn: ({ signal }) =>
      id ? chatApi.getConversation(id, { signal }) : Promise.reject(new Error('Conversation ID is required')),
    ...options,
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

export const useDirectConversationQuery = (
  userId?: string,
  options?: QueryHookOptions<Paginated<ConversationSummary>>,
) =>
  useQuery({
    queryKey: userId ? chatKeys.directLookup(userId) : ['chat', 'direct', 'disabled'],
    queryFn: ({ signal }) =>
      userId ? chatApi.getDirectConversation(userId, { signal }) : Promise.reject(new Error('User ID is required')),
    ...options,
    enabled: Boolean(userId) && (options?.enabled ?? true),
  });

export const useMessagesQuery = (id?: string, options?: InfiniteQueryHookOptions<MessagePage, string | undefined>) =>
  useInfiniteQuery({
    queryKey: id ? chatKeys.messages(id) : ['chat', 'messages', 'disabled'],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      id ? chatApi.getMessages(id, pageParam, { signal }) : Promise.reject(new Error('Conversation ID is required')),
    getNextPageParam: (page) => (page.pagination.hasNextPage ? (page.pagination.nextCursor ?? undefined) : undefined),
    ...options,
    refetchOnMount: 'always',
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

export const useUnreadSummaryQuery = (enabled = true, options?: QueryHookOptions<UnreadSummary>) =>
  useQuery({
    queryKey: CHAT_UNREAD_QUERY_KEY,
    queryFn: ({ signal }) => chatApi.getUnreadSummary({ signal }),
    ...options,
    enabled: enabled && (options?.enabled ?? true),
  });
