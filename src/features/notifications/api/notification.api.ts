import type { AxiosRequestConfig } from 'axios';
import { http } from '@/lib/api/http';
import type { CursorPaginated } from '@/types/api';
import { NOTIFICATION_API_ROUTES, NOTIFICATION_PAGE_SIZE } from '../constants/notification.constants';
import type { NotificationCategory, NotificationItem, NotificationPreferences } from '../types/notification.dto';

export const notificationApi = {
  list: (cursor?: string, unreadOnly = false, config?: AxiosRequestConfig) =>
    http.getCursorPage<NotificationItem>(
      NOTIFICATION_API_ROUTES.LIST,
      {
        cursor,
        pageSize: NOTIFICATION_PAGE_SIZE,
        ...(unreadOnly ? { 'filter[unreadOnly]': true } : {}),
      },
      config,
    ),
  markRead: (id: string) => http.post<{ id: string; readAt: string }>(NOTIFICATION_API_ROUTES.MARK_READ(id)),
  markAllRead: () => http.post<{ markedCount: number }>(NOTIFICATION_API_ROUTES.MARK_ALL_READ),
  getPreferences: (config?: AxiosRequestConfig) =>
    http.get<NotificationPreferences[]>(NOTIFICATION_API_ROUTES.PREFERENCES, config),
  updatePreferences: (preferences: NotificationPreferences[], config?: AxiosRequestConfig) =>
    http.put<{ updatedAt: string }>(NOTIFICATION_API_ROUTES.PREFERENCES, { preferences }, config),
};

export type NotificationCursorPage = CursorPaginated<NotificationItem>;
export type { NotificationCategory };
