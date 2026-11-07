import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';
import type { ConversationMember } from '../types/chat.dto';

export interface AddConversationMembersVariables {
  conversationId: string;
  userIds: string[];
}

export const useAddConversationMembersMutation = (
  options?: MutationHookOptions<ConversationMember[], AddConversationMembersVariables>,
) => {
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: ({ conversationId, userIds }) => chatApi.addMembers(conversationId, { userIds }),
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1].conversationId);
      return options?.onSuccess?.(...args);
    },
  });
};
