import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { buildingApi } from '../api/building.api';
import { BUILDING_QUERY_KEYS } from '../constants/building.constants';
import type { BuildingFilter, BuildingMyListItemDto } from '../types/building.dto';

export const useMyBuildingsQuery = (
  params?: ListParams<BuildingFilter>,
  options?: QueryHookOptions<Paginated<BuildingMyListItemDto>>,
) =>
  useQuery<Paginated<BuildingMyListItemDto>>({
    queryKey: BUILDING_QUERY_KEYS.MY_LIST(params),
    queryFn: () => buildingApi.getMyBuildings(params),
    placeholderData: keepPreviousData,
    ...options,
  });
