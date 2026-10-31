import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingApi } from '../../api/building.api';
import { BUILDING_QUERY_KEYS } from '../../constants/building.constants';
import type { BuildingApproveRequestDto, BuildingApproveResponseDto } from '../../types/building.dto';

interface ApproveBuildingVariables {
  id: string;
  payload?: BuildingApproveRequestDto;
}

export const useApproveBuildingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<BuildingApproveResponseDto, Error, ApproveBuildingVariables>({
    mutationFn: ({ id, payload }) => buildingApi.approveBuilding(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      void queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ADMIN_DETAIL(id) });
    },
  });
};
