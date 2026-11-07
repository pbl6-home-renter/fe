import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';

export interface UpdateConversationMemberRoleVariables {
  conversationId: string;
  userId: string;
  role: 'admin' | 'member';
}

export const useUpdateConversationMemberRoleMutation = (
  options?: MutationHookOptions<void, UpdateConversationMemberRoleVariables>,
) => {
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: ({ conversationId, userId, role }) => chatApi.updateMemberRole(conversationId, userId, { role }),
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1].conversationId);
      return options?.onSuccess?.(...args);
    },
  });
};
