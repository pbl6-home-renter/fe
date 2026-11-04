import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { CHAT_LIST_QUERY_KEY, CHAT_UNREAD_QUERY_KEY, chatKeys } from '../constants/chat.constants';
import type { MutationHookOptions } from '@/lib/query/types';
import type { ConversationDetail, CreateGroupRequest } from '../types/chat.dto';

export const useCreateGroupMutation = (options?: MutationHookOptions<ConversationDetail, CreateGroupRequest>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateGroupRequest) => chatApi.createGroup(body),
    ...options,
    onSuccess: async (...args) => {
      const [conversation] = args;
      client.setQueryData(chatKeys.detail(conversation.id), conversation);
      await client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
      return options?.onSuccess?.(...args);
    },
  });
};

export interface MarkReadVariables {
  conversationId: string;
  sequence: string;
}

export const useMarkReadMutation = (
  options?: MutationHookOptions<{ conversationId: string; unreadCount: number }, MarkReadVariables>,
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, sequence }: MarkReadVariables) => chatApi.markRead(conversationId, sequence),
    ...options,
    onSuccess: async (...args) => {
      const [, variables] = args;
      await Promise.all([
        client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY }),
        client.invalidateQueries({ queryKey: CHAT_UNREAD_QUERY_KEY }),
        client.invalidateQueries({ queryKey: chatKeys.detail(variables.conversationId) }),
      ]);
      return options?.onSuccess?.(...args);
    },
  });
};
