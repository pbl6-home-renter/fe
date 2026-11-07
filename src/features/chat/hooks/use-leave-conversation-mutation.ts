import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';

export const useLeaveConversationMutation = (options?: MutationHookOptions<void, string>) => {
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: chatApi.leaveConversation,
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1]);
      return options?.onSuccess?.(...args);
    },
  });
};
