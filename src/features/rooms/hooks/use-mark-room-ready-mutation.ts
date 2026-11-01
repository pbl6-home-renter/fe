import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomMarkReadyResponseDto } from '../types/room.dto';

export const useMarkRoomReadyMutation = (
  options?: MutationHookOptions<RoomMarkReadyResponseDto, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.markRoomReady(id),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.DETAIL(variables) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
