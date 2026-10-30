export const BuildingStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type BuildingStatus = (typeof BuildingStatus)[keyof typeof BuildingStatus];
