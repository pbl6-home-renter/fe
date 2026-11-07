import { useMutation } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { chatApi } from '../api/chat.api';
import { useInvalidateConversationQueries } from './use-invalidate-conversation-queries';
import type { ConversationMetadataResponse } from '../types/chat.dto';

export interface UpdateGroupAvatarVariables {
  conversationId: string;
  file: File;
}

export const useUpdateGroupAvatarMutation = (
  options?: MutationHookOptions<ConversationMetadataResponse, UpdateGroupAvatarVariables>,
) => {
  const upload = useMediaUpload();
  const invalidate = useInvalidateConversationQueries();
  return useMutation({
    mutationFn: async ({ conversationId, file }) => {
      const media = await upload.uploadAsync({
        file,
        ownerType: MediaOwnerType.CONVERSATION,
        ownerId: conversationId,
        purpose: MediaPurpose.CONVERSATION_AVATAR,
        skipSuccessToast: true,
      });
      return chatApi.updateConversation(conversationId, { avatarMediaId: media.id });
    },
    ...options,
    onSuccess: async (...args) => {
      await invalidate(args[1].conversationId);
      return options?.onSuccess?.(...args);
    },
  });
};
