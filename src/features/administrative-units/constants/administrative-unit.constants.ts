export const ADMINISTRATIVE_UNIT_QUERY_KEYS = {
  PROVINCES: () => ['administrative-units', 'provinces'] as const,
  WARDS: (provinceCode?: string) =>
    ['administrative-units', 'wards', provinceCode] as const,
};
