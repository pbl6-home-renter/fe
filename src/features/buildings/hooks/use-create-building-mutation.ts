import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { buildingApi } from '../api/building.api';
import { BUILDING_QUERY_KEYS } from '../constants/building.constants';
import type { BuildingCreateRequestDto, BuildingCreateResponseDto } from '../types/building.dto';

export const useCreateBuildingMutation = (
  options?: MutationHookOptions<BuildingCreateResponseDto, BuildingCreateRequestDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buildingApi.createBuilding,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
