export interface PopularAreaItem {
  id: string;
  name: string;
  province: string;
  type: 'city';
}

export const POPULAR_AREAS: PopularAreaItem[] = [
  { id: 'ha-noi', name: 'Hà Nội', province: 'Thành phố Hà Nội', type: 'city' },
  { id: 'hai-phong', name: 'Hải Phòng', province: 'Thành phố Hải Phòng', type: 'city' },
  { id: 'hue', name: 'Huế', province: 'Thành phố Huế', type: 'city' },
  { id: 'da-nang', name: 'Đà Nẵng', province: 'Thành phố Đà Nẵng', type: 'city' },
  { id: 'can-tho', name: 'Cần Thơ', province: 'Thành phố Cần Thơ', type: 'city' },
  { id: 'tp-ho-chi-minh', name: 'TP. Hồ Chí Minh', province: 'Thành phố Hồ Chí Minh', type: 'city' },
];
