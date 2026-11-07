import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';

export interface RemoveConversationMemberVariables {
  conversationId: string;
  userId: string;
}

export const useRemoveConversationMemberMutation = (
  options?: MutationHookOptions<void, RemoveConversationMemberVariables>,
) => {
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: ({ conversationId, userId }) => chatApi.removeMember(conversationId, userId),
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1].conversationId);
      return options?.onSuccess?.(...args);
    },
  });
};
