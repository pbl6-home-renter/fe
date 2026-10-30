import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { mediaApi } from '../api/media.api';
import { MEDIA_QUERY_KEYS } from '../constants/media.constants';

/** Soft-deletes a media by id. Not needed to replace an avatar/cover photo. */
export const useDeleteMediaMutation = (options?: MutationHookOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mediaApi.delete,
    ...options,
    onSuccess: (data, mediaId, ...rest) => {
      queryClient.removeQueries({ queryKey: MEDIA_QUERY_KEYS.OBJECT(mediaId) });
      return options?.onSuccess?.(data, mediaId, ...rest);
    },
  });
};
