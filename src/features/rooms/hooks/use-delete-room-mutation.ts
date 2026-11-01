import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';

export const useDeleteRoomMutation = (
  options?: MutationHookOptions<void, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.deleteRoom(id),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
