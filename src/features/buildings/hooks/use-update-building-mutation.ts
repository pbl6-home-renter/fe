import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { buildingApi } from '../api/building.api';
import { BUILDING_QUERY_KEYS } from '../constants/building.constants';
import type { BuildingUpdateRequestDto, BuildingUpdateResponseDto } from '../types/building.dto';

interface UpdateBuildingVariables {
  id: string;
  payload: BuildingUpdateRequestDto;
}

export const useUpdateBuildingMutation = (
  options?: MutationHookOptions<BuildingUpdateResponseDto, UpdateBuildingVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBuildingVariables) =>
      buildingApi.updateBuilding(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
