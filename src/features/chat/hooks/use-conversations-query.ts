import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { CHAT_PAGE_SIZE, CHAT_SEARCH_DEBOUNCE_MS, chatKeys } from '../constants/chat.constants';
import { chatApi } from '../api/chat.api';
import type { InfiniteQueryHookOptions } from '@/lib/query/types';
import type { ConversationSummary } from '../types/chat.dto';
import type { Paginated } from '@/types/api';

export const useConversationsQuery = (
  search: string,
  options?: InfiniteQueryHookOptions<Paginated<ConversationSummary>, number>,
) => {
  const rawSearch = search.trim();
  const debouncedSearch = useDebounce(rawSearch, CHAT_SEARCH_DEBOUNCE_MS, true);
  const querySearch = rawSearch ? debouncedSearch : '';
  const isSearchPending = rawSearch !== querySearch;
  const query = useInfiniteQuery({
    queryKey: chatKeys.list(querySearch),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      chatApi.getConversations(
        {
          pageNo: pageParam,
          pageSize: CHAT_PAGE_SIZE,
          hasContext: false,
          ...(querySearch ? { q: querySearch } : {}),
        },
        { signal },
      ),
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.pageNo + 1 : undefined),
    placeholderData: keepPreviousData,
    refetchOnMount: 'always',
    ...options,
  });
  return { ...query, isSearchPending };
};
