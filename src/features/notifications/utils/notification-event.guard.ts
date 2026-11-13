import type { NotificationCreatedEvent } from '../types/notification.dto';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isNotificationCreatedEvent = (value: unknown): value is NotificationCreatedEvent =>
  isRecord(value) &&
  typeof value.notificationId === 'string' &&
  (value.type === 'invoice' || value.type === 'issue' || value.type === 'system') &&
  typeof value.title === 'string' &&
  typeof value.body === 'string' &&
  (value.deepLink === null || typeof value.deepLink === 'string') &&
  (value.data === null || isRecord(value.data)) &&
  typeof value.createdAt === 'string';
