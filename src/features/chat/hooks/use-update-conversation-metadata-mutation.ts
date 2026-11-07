import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';
import type { ConversationMetadataResponse, UpdateConversationMetadataRequest } from '../types/chat.dto';

export interface UpdateConversationMetadataVariables {
  conversationId: string;
  body: UpdateConversationMetadataRequest;
}

export const useUpdateConversationMetadataMutation = (
  options?: MutationHookOptions<ConversationMetadataResponse, UpdateConversationMetadataVariables>,
) => {
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: ({ conversationId, body }) => chatApi.updateConversation(conversationId, body),
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1].conversationId);
      return options?.onSuccess?.(...args);
    },
  });
};
