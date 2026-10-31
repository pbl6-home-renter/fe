import { useQuery } from '@tanstack/react-query';
import { buildingApi } from '../../api/building.api';
import { BUILDING_QUERY_KEYS } from '../../constants/building.constants';

export const useAdminBuildingQuery = (id: string) => {
  return useQuery({
    queryKey: BUILDING_QUERY_KEYS.ADMIN_DETAIL(id),
    queryFn: () => buildingApi.getAdminBuilding(id),
    enabled: Boolean(id),
  });
};
