export const RoomStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  PENDING_CLEANUP: 'pending_cleanup',
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];
