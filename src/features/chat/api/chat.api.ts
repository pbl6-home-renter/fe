import type { AxiosRequestConfig } from 'axios';
import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import { CHAT_API_ROUTES, CHAT_HISTORY_PAGE_SIZE } from '../constants/chat.constants';
import type {
  ChatMessage,
  ConversationDetail,
  ConversationSummary,
  CreateDirectRequest,
  CreateGroupRequest,
  MessagePage,
  SendTextMessageRequest,
  SentMessage,
  UnreadSummary,
  UserDirectoryEntry,
} from '../types/chat.dto';

export interface ConversationListParams {
  pageNo: number;
  pageSize: number;
  kind?: 'direct' | 'group';
  hasContext?: false;
  q?: string;
  otherUserId?: string;
}

export interface DirectoryParams {
  pageNo: number;
  pageSize: number;
  q?: string;
}

export const chatApi = {
  getConversations: (params: ConversationListParams, config?: AxiosRequestConfig) =>
    http.getPageWithParams<ConversationSummary, ConversationListParams>(CHAT_API_ROUTES.CONVERSATIONS, params, config),

  getDirectConversation: (otherUserId: string, config?: AxiosRequestConfig) =>
    http.getPageWithParams<ConversationSummary, ConversationListParams>(
      CHAT_API_ROUTES.CONVERSATIONS,
      {
        kind: 'direct',
        otherUserId,
        pageNo: 1,
        pageSize: 1,
      },
      config,
    ),

  getConversation: (id: string, config?: AxiosRequestConfig) =>
    http.get<ConversationDetail>(CHAT_API_ROUTES.CONVERSATION(id), config),

  getMessages: (conversationId: string, cursor?: string, config?: AxiosRequestConfig) =>
    http.getCursorPage<ChatMessage, { conversationId: string; cursor?: string; pageSize: number }>(
      CHAT_API_ROUTES.MESSAGES,
      { conversationId, cursor, pageSize: CHAT_HISTORY_PAGE_SIZE },
      config,
    ),

  getUnreadSummary: (config?: AxiosRequestConfig) => http.get<UnreadSummary>(CHAT_API_ROUTES.UNREAD_SUMMARY, config),

  getDirectory: (params: DirectoryParams, config?: AxiosRequestConfig) =>
    http.getPageWithParams<UserDirectoryEntry, DirectoryParams>(CHAT_API_ROUTES.USER_DIRECTORY, params, config),

  createGroup: (body: CreateGroupRequest) => http.post<ConversationDetail>(CHAT_API_ROUTES.CONVERSATIONS, body),

  createDirect: (body: CreateDirectRequest, config?: AxiosRequestConfig) =>
    http.post<ConversationDetail>(CHAT_API_ROUTES.CONVERSATIONS, body, {
      ...config,
      skipSuccessToast: true,
      skipErrorToast: true,
    }),

  sendText: (body: SendTextMessageRequest, config?: AxiosRequestConfig) =>
    http.post<SentMessage>(CHAT_API_ROUTES.MESSAGES, body, config),

  markRead: (conversationId: string, lastReadSequence: string) =>
    http.post<{ conversationId: string; unreadCount: number }>(CHAT_API_ROUTES.MARK_READ, {
      conversationId,
      lastReadSequence,
    }),
};

export type ConversationListPage = Paginated<ConversationSummary>;
export type ChatHistoryPage = MessagePage;
