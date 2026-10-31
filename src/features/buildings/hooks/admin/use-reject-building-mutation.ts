import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingApi } from '../../api/building.api';
import { BUILDING_QUERY_KEYS } from '../../constants/building.constants';
import type { BuildingRejectRequestDto, BuildingRejectResponseDto } from '../../types/building.dto';

interface RejectBuildingVariables {
  id: string;
  payload: BuildingRejectRequestDto;
}

export const useRejectBuildingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<BuildingRejectResponseDto, Error, RejectBuildingVariables>({
    mutationFn: ({ id, payload }) => buildingApi.rejectBuilding(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      void queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ADMIN_DETAIL(id) });
    },
  });
};
