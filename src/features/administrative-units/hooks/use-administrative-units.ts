import { useQuery } from '@tanstack/react-query';
import { administrativeUnitApi } from '../api/administrative-unit.api';
import { ADMINISTRATIVE_UNIT_QUERY_KEYS } from '../constants/administrative-unit.constants';
import type {
  AdministrativeProvinceDto,
  AdministrativeWardDto,
} from '../types/administrative-unit.types';

export const useProvincesQuery = () => {
  return useQuery<AdministrativeProvinceDto[]>({
    queryKey: ADMINISTRATIVE_UNIT_QUERY_KEYS.PROVINCES(),
    queryFn: administrativeUnitApi.getProvinces,
    staleTime: Infinity,
  });
};

export const useWardsQuery = (provinceCode?: string) => {
  return useQuery<AdministrativeWardDto[]>({
    queryKey: ADMINISTRATIVE_UNIT_QUERY_KEYS.WARDS(provinceCode),
    queryFn: () => {
      if (!provinceCode) return Promise.resolve([]);
      return administrativeUnitApi.getWards(provinceCode);
    },
    enabled: Boolean(provinceCode),
    staleTime: Infinity,
  });
};
