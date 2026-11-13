import type { CursorPaginationMeta } from '@/types/api';

export type NotificationCategory = 'chat' | 'invoice' | 'issue' | 'system';
export type BusinessNotificationCategory = Exclude<NotificationCategory, 'chat'>;

export interface NotificationCreatedEvent {
  notificationId: string;
  type: BusinessNotificationCategory;
  title: string;
  body: string;
  deepLink: string | null;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  sourceService: string;
  eventId: string;
  type: string;
  title: string;
  body: string;
  deepLink: string | null;
  data: Record<string, unknown> | null;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPage {
  items: NotificationItem[];
  pagination: CursorPaginationMeta;
}

export interface NotificationPreferences {
  type: NotificationCategory;
  pushEnabled: boolean;
}
