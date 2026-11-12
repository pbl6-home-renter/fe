import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { CHAT_SEARCH_DEBOUNCE_MS, DIRECTORY_PAGE_SIZE, chatKeys } from '../constants/chat.constants';
import { chatApi } from '../api/chat.api';
import type { InfiniteQueryHookOptions } from '@/lib/query/types';
import type { UserDirectoryPage } from '../types/chat.dto';

export const useUserDirectoryQuery = (
  search: string,
  enabled: boolean,
  options?: InfiniteQueryHookOptions<UserDirectoryPage, number>,
) => {
  const rawSearch = search.trim();
  const debouncedSearch = useDebounce(rawSearch, CHAT_SEARCH_DEBOUNCE_MS, true);
  const querySearch = rawSearch ? debouncedSearch : '';
  const isSearchPending = rawSearch !== querySearch;
  const query = useInfiniteQuery({
    queryKey: chatKeys.directory(querySearch),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      chatApi.getDirectory(
        {
          pageNo: pageParam,
          pageSize: DIRECTORY_PAGE_SIZE,
          ...(querySearch ? { q: querySearch } : {}),
        },
        { signal },
      ),
    getNextPageParam: (page) => (page.pagination.hasNextPage ? page.pagination.pageNo + 1 : undefined),
    ...options,
    enabled: enabled && (options?.enabled ?? true),
  });
  return { ...query, isSearchPending };
};
