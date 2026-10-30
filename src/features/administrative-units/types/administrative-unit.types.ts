export interface AdministrativeProvinceDto {
  code: string;
  name: string;
  divisionType: string;
}

export interface AdministrativeWardDto {
  code: string;
  provinceCode: string;
  name: string;
  divisionType: string;
}
