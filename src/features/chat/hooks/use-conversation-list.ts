import { useEffect, useRef } from 'react';
import { useConversationsQuery } from './use-conversations-query';
import { CHAT_LIST_LOAD_MORE_THRESHOLD_PX } from '../constants/chat.constants';

export const useConversationList = (search: string) => {
  const query = useConversationsQuery(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;
  const conversations = query.data?.pages.flatMap((page) => page.items) ?? [];
  const conversationCount = conversations.length;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [search]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handleScroll = () => {
      if (
        element.scrollTop + element.clientHeight >= element.scrollHeight - CHAT_LIST_LOAD_MORE_THRESHOLD_PX &&
        hasNextPage &&
        !query.isSearchPending &&
        !query.isPlaceholderData &&
        !isFetchingNextPage &&
        !isFetchNextPageError
      )
        void fetchNextPage();
    };
    element.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => element.removeEventListener('scroll', handleScroll);
  }, [
    conversationCount,
    fetchNextPage,
    hasNextPage,
    query.isSearchPending,
    query.isPlaceholderData,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  return { query, scrollRef, conversations };
};
