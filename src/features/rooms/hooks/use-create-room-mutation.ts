import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomCreateRequestDto, RoomDetailDto } from '../types/room.dto';

export const useCreateRoomMutation = (
  options?: MutationHookOptions<RoomDetailDto, RoomCreateRequestDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoomCreateRequestDto) => roomApi.createRoom(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
