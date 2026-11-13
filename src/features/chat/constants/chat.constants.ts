import { ROUTES } from '@/config/routes.config';

export const CHAT_PAGE_SIZE = 20;
export const DIRECTORY_PAGE_SIZE = 20;
export const CHAT_HISTORY_PAGE_SIZE = 30;
export const CHAT_MESSAGE_MAX_LENGTH = 4000;
export const CHAT_GROUP_TITLE_MAX_LENGTH = 255;
export const CHAT_GROUP_MINIMUM_OTHER_MEMBERS = 2;
export const CHAT_SEARCH_MAX_LENGTH = 100;
export const CHAT_SEARCH_DEBOUNCE_MS = 300;
export const CHAT_MESSAGE_SEARCH_PAGE_SIZE = 20;
export const CHAT_TYPING_THROTTLE_MS = 2000;
export const CHAT_TYPING_EXPIRE_MS = 4000;
export const CHAT_SEND_ATTEMPT_LIMIT = 3;
export const CHAT_SEND_RETRY_DELAY_MS = 700;
export const CHAT_SEND_TIMEOUT_MS = 15_000;
export const CHAT_SEEN_MESSAGE_CACHE_LIMIT = 500;
export const CHAT_UNREAD_BADGE_MAX = 9;
export const CHAT_LIST_LOAD_MORE_THRESHOLD_PX = 80;
export const CHAT_FEED_BOTTOM_THRESHOLD_PX = 80;
export const CHAT_FEED_OLDER_THRESHOLD_PX = 60;
export const CHAT_FEED_NEWER_THRESHOLD_PX = 120;
export const CHAT_HIGHLIGHT_DURATION_MS = 2400;
/** Distance the feed glides when returning to the latest message. */
export const CHAT_BACK_TO_LATEST_GLIDE_PX = 720;
export const CHAT_DIRECTORY_LOAD_MORE_THRESHOLD_PX = 48;
export const CHAT_API_ROUTES = {
  CONVERSATIONS: '/conversations',
  CONVERSATION: (id: string) => `/conversations/${id}`,
  UNREAD_SUMMARY: '/conversations/unread-summary',
  MESSAGES: '/messages',
  MESSAGE_SEARCH: '/messages/search',
  MARK_READ: '/messages/mark-read',
  USER_DIRECTORY: '/users/directory',
  MEMBERS: (id: string) => `/conversations/${id}/members`,
  MEMBER_ROLE: (conversationId: string, userId: string) => `/conversations/${conversationId}/members/${userId}/role`,
  MEMBER: (conversationId: string, userId: string) => `/conversations/${conversationId}/members/${userId}`,
  LEAVE: (id: string) => `/conversations/${id}/members/me`,
} as const;

export const CHAT_SOCKET_EVENTS = {
  JOIN: 'conversation:join',
  LEAVE: 'conversation:leave',
  MESSAGE_CREATED: 'message:created',
  MESSAGE_RECEIVED: 'chat:message-received',
  READ_UPDATED: 'conversation:read-updated',
  MEMBER_READ: 'conversation:member-read',
  TYPING: 'conversation:typing',
  ACCESS_REVOKED: 'conversation:access-revoked',
  AVAILABLE: 'conversation:available',
} as const;

export const getChatPath = (conversationId?: string, search?: string): string => {
  const pathname = conversationId ? ROUTES.CHAT_DETAIL(conversationId) : ROUTES.CHAT;
  return search ? `${pathname}?${new URLSearchParams({ q: search })}` : pathname;
};

export const isChatPath = (pathname: string): boolean =>
  pathname === ROUTES.CHAT || pathname.startsWith(`${ROUTES.CHAT}/`);

export const getChatDraftKey = (state: unknown): string | undefined =>
  typeof state === 'object' &&
  state !== null &&
  !Array.isArray(state) &&
  'chatDraftKey' in state &&
  typeof state.chatDraftKey === 'string'
    ? state.chatDraftKey
    : undefined;

export const CHAT_LIST_QUERY_KEY = ['chat', 'conversations'] as const;
export const CHAT_UNREAD_QUERY_KEY = ['chat', 'unread-summary'] as const;
export const CHAT_DIRECTORY_QUERY_KEY = ['chat', 'user-directory'] as const;

export const chatKeys = {
  list: (search: string) => [...CHAT_LIST_QUERY_KEY, search] as const,
  detail: (id: string) => ['chat', 'conversation', id] as const,
  messageHistory: (id: string) => ['chat', 'messages', id] as const,
  messages: (id: string, maxSequence?: string) => ['chat', 'messages', id, maxSequence ?? 'latest'] as const,
  messageSearch: (id: string, query: string) => ['chat', 'message-search', id, query] as const,
  directLookup: (userId: string) => ['chat', 'direct', userId] as const,
  directory: (search: string) => [...CHAT_DIRECTORY_QUERY_KEY, search] as const,
};
