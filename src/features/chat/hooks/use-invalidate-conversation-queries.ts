import { useQueryClient } from '@tanstack/react-query';
import { CHAT_LIST_QUERY_KEY, chatKeys } from '../constants/chat.constants';

export const useInvalidateConversationQueries = () => {
  const client = useQueryClient();
  return async (conversationId: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: chatKeys.detail(conversationId) }),
      client.invalidateQueries({ queryKey: chatKeys.messageHistory(conversationId) }),
      client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY }),
    ]);
  };
};
