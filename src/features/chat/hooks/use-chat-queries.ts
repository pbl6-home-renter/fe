import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CHAT_UNREAD_QUERY_KEY, chatKeys } from '../constants/chat.constants';
import { chatApi } from '../api/chat.api';
import type { InfiniteQueryHookOptions, QueryHookOptions } from '@/lib/query/types';
import type {
  ChatMessageSearchResult,
  ConversationDetail,
  ConversationSummary,
  MessagePage,
  UnreadSummary,
} from '../types/chat.dto';
import type { CursorPaginated, Paginated } from '@/types/api';

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

/** Older pages use the cursor; newer pages (only while anchored) start after a sequence. */
export type MessagePageParam = string | undefined | { afterSequence: string };

/** Every page is stored newest first; `direction` marks pages fetched towards the latest message. */
export type MessageHistoryPage = MessagePage & { direction?: 'newer' };

export const useMessagesQuery = (
  id?: string,
  maxSequence?: string,
  options?: InfiniteQueryHookOptions<MessageHistoryPage, MessagePageParam>,
) =>
  useInfiniteQuery({
    queryKey: id ? chatKeys.messages(id, maxSequence) : ['chat', 'messages', 'disabled'],
    initialPageParam: undefined as MessagePageParam,
    queryFn: async ({ pageParam, signal }): Promise<MessageHistoryPage> => {
      if (!id) throw new Error('Conversation ID is required');
      if (typeof pageParam === 'object') {
        const page = await chatApi.getMessages(id, { afterSequence: pageParam.afterSequence }, { signal });
        return { ...page, items: [...page.items].reverse(), direction: 'newer' };
      }
      return chatApi.getMessages(id, { cursor: pageParam, maxSequence }, { signal });
    },
    getNextPageParam: (page) => (page.pagination.hasNextPage ? (page.pagination.nextCursor ?? undefined) : undefined),
    // Live history follows the socket; an opened (anchored) window loads newer pages on demand.
    getPreviousPageParam: (firstPage) => {
      if (!maxSequence) return undefined;
      if (firstPage.direction === 'newer' && !firstPage.pagination.hasNextPage) return undefined;
      return { afterSequence: firstPage.items[0]?.sequence ?? maxSequence };
    },
    ...options,
    refetchOnMount: 'always',
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

export const useMessageSearchQuery = (
  id: string | undefined,
  query: string,
  options?: InfiniteQueryHookOptions<CursorPaginated<ChatMessageSearchResult>, string | undefined>,
) =>
  useInfiniteQuery({
    queryKey: id ? chatKeys.messageSearch(id, query) : ['chat', 'message-search', 'disabled'],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      id
        ? chatApi.searchMessages(id, query, pageParam, { signal })
        : Promise.reject(new Error('Conversation ID is required')),
    getNextPageParam: (page) => (page.pagination.hasNextPage ? (page.pagination.nextCursor ?? undefined) : undefined),
    ...options,
    enabled: Boolean(id) && query.length >= 2 && (options?.enabled ?? true),
  });

export const useUnreadSummaryQuery = (enabled = true, options?: QueryHookOptions<UnreadSummary>) =>
  useQuery({
    queryKey: CHAT_UNREAD_QUERY_KEY,
    queryFn: ({ signal }) => chatApi.getUnreadSummary({ signal }),
    ...options,
    enabled: enabled && (options?.enabled ?? true),
  });
