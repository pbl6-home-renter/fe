import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { CHAT_HISTORY_PAGE_SIZE, chatKeys } from '../constants/chat.constants';
import type { ChatMessage } from '../types/chat.dto';
import type { CursorPaginated } from '@/types/api';

type ChatMessagePages = InfiniteData<CursorPaginated<ChatMessage>, string | undefined>;

export const upsertChatMessageCache = (client: QueryClient, message: ChatMessage) => {
  client.setQueryData<ChatMessagePages>(chatKeys.messages(message.conversationId), (current) => {
    const exists = current?.pages.some((page) =>
      page.items.some(
        (item) =>
          item.id === message.id ||
          (message.clientMessageId !== null && item.clientMessageId === message.clientMessageId),
      ),
    );
    if (exists) return current;

    const latestPage = current?.pages[0];
    const items = [...(latestPage?.items ?? []), message].sort((left, right) => {
      const leftSequence = BigInt(left.sequence);
      const rightSequence = BigInt(right.sequence);
      return leftSequence === rightSequence ? 0 : leftSequence > rightSequence ? -1 : 1;
    });
    const nextPage: CursorPaginated<ChatMessage> = latestPage
      ? { ...latestPage, items }
      : {
          items,
          pagination: {
            type: 'cursor',
            pageSize: CHAT_HISTORY_PAGE_SIZE,
            nextCursor: null,
            hasNextPage: false,
          },
        };

    return current
      ? { ...current, pages: [nextPage, ...current.pages.slice(1)] }
      : { pages: [nextPage], pageParams: [undefined] };
  });
};
