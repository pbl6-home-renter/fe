import { useQuery } from '@tanstack/react-query';
import { buildingApi } from '../../api/building.api';
import { BUILDING_QUERY_KEYS } from '../../constants/building.constants';
import type { ListParams } from '@/types/api';
import type { BuildingAdminFilter } from '../../types/building.dto';

export const useAdminBuildingsQuery = (params?: ListParams<BuildingAdminFilter>) => {
  return useQuery({
    queryKey: BUILDING_QUERY_KEYS.ADMIN_LIST(params),
    queryFn: () => buildingApi.getAdminBuildings(params),
  });
};
