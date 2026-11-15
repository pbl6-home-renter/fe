export interface PopularAreaItem {
  id: string;
  type: 'ward' | 'district';
  name: string;
  district: string;
  ward?: string;
}

export const POPULAR_AREAS: PopularAreaItem[] = [
  { id: '1', type: 'ward', name: 'Hòa Khánh', district: 'Liên Chiểu', ward: 'Hòa Khánh Bắc' },
  { id: '2', type: 'district', name: 'Hải Châu', district: 'Hải Châu' },
  { id: '3', type: 'district', name: 'Ngũ Hành Sơn', district: 'Ngũ Hành Sơn' },
  { id: '4', type: 'district', name: 'Cẩm Lệ', district: 'Cẩm Lệ' },
  { id: '5', type: 'district', name: 'Sơn Trà', district: 'Sơn Trà' },
  { id: '6', type: 'district', name: 'Thanh Khê', district: 'Thanh Khê' },
];
