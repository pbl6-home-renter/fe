export const MeterType = {
  ELECTRICITY: 'electricity',
  WATER: 'water',
} as const;

export type MeterType = (typeof MeterType)[keyof typeof MeterType];
