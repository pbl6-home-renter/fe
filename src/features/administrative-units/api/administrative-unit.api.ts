import { http } from '@/lib/api/http';
import type {
  AdministrativeProvinceDto,
  AdministrativeWardDto,
} from '../types/administrative-unit.types';

export const administrativeUnitApi = {
  getProvinces: () =>
    http.get<AdministrativeProvinceDto[]>('/administrative-units/provinces'),

  getWards: (provinceCode: string) =>
    http.get<AdministrativeWardDto[]>(
      `/administrative-units/provinces/${provinceCode}/wards`
    ),
};
