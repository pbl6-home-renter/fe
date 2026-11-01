import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { roomApi } from '../api/room.api';
import { ROOM_QUERY_KEYS } from '../constants/room.constants';
import type { RoomDetailDto, RoomUpdateRequestDto } from '../types/room.dto';

interface UpdateRoomVariables {
  id: string;
  payload: RoomUpdateRequestDto;
}

export const useUpdateRoomMutation = (
  options?: MutationHookOptions<RoomDetailDto, UpdateRoomVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateRoomVariables) => roomApi.updateRoom(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.DETAIL(variables.id) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
