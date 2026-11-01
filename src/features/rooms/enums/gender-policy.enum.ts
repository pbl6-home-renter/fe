export const GenderPolicy = {
  ANY: 'any',
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type GenderPolicy = (typeof GenderPolicy)[keyof typeof GenderPolicy];
