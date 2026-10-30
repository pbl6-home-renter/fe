import { useQuery } from '@tanstack/react-query';
import { buildingApi } from '../api/building.api';
import { BUILDING_QUERY_KEYS } from '../constants/building.constants';
import type { BuildingMyDetailDto } from '../types/building.dto';

export const useMyBuildingQuery = (id: string) =>
  useQuery<BuildingMyDetailDto>({
    queryKey: BUILDING_QUERY_KEYS.MY_DETAIL(id),
    queryFn: () => buildingApi.getMyBuilding(id),
    enabled: Boolean(id),
  });
