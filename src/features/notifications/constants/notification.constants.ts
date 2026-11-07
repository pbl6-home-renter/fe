export const NOTIFICATION_PAGE_SIZE = 20;

export const NOTIFICATION_API_ROUTES = {
  LIST: '/notifications',
  MARK_ALL_READ: '/notifications/mark-all-read',
  MARK_READ: (id: string) => `/notifications/${id}/mark-read`,
  PREFERENCES: '/me/notification-preference',
} as const;

export const NOTIFICATION_QUERY_KEY = ['notifications'] as const;
export const NOTIFICATION_PREFERENCES_QUERY_KEY = ['notification-preferences'] as const;
export const NOTIFICATION_QUERY_KEYS = {
  all: NOTIFICATION_QUERY_KEY,
  list: (unreadOnly: boolean) => [...NOTIFICATION_QUERY_KEY, unreadOnly ? 'unread' : 'all'] as const,
  unreadIndicator: [...NOTIFICATION_QUERY_KEY, 'unread-indicator'] as const,
  preferences: NOTIFICATION_PREFERENCES_QUERY_KEY,
} as const;

export const NOTIFICATION_SOCKET_EVENTS = {
  CREATED: 'notification:created',
  READ_STATE_UPDATED: 'notification:read-state-updated',
} as const;

export const NOTIFICATION_CATEGORIES = ['chat', 'invoice', 'issue'] as const;
