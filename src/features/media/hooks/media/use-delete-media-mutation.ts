import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, useAppMutation, type UseAppMutationOptions } from '@/lib/react-query';
import { mediaApi } from '../../api/media.api';

/** Soft-deletes a media by id. Not needed to replace an avatar/cover photo. */
export const useDeleteMediaMutation = (
  options?: Partial<UseAppMutationOptions<void, Error, string>>
) => {
  const queryClient = useQueryClient();

  return useAppMutation<void, Error, string>({
    mutationFn: (mediaId) => mediaApi.delete(mediaId),
    ...options,
    onSuccess: (data, mediaId, ...rest) => {
      queryClient.removeQueries({ queryKey: queryKeys.media.object(mediaId) });
      options?.onSuccess?.(data, mediaId, ...rest);
    },
  });
};
