import type { AxiosRequestConfig } from 'axios';
import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import { CHAT_API_ROUTES, CHAT_HISTORY_PAGE_SIZE, CHAT_MESSAGE_SEARCH_PAGE_SIZE } from '../constants/chat.constants';
import type {
  ChatMessage,
  ChatMessageSearchResult,
  ConversationDetail,
  ConversationSummary,
  CreateDirectRequest,
  CreateGroupRequest,
  MessagePage,
  SendMessageRequest,
  SentMessage,
  UnreadSummary,
  UserDirectoryEntry,
  ConversationMember,
  UpdateConversationMetadataRequest,
  AddConversationMembersRequest,
  UpdateConversationMemberRoleRequest,
  ConversationMetadataResponse,
} from '../types/chat.dto';

export interface ConversationListParams {
  pageNo: number;
  pageSize: number;
  kind?: 'direct' | 'group';
  hasContext?: false;
  q?: string;
  otherUserId?: string;
}

export interface MessageRange {
  cursor?: string;
  maxSequence?: string;
  afterSequence?: string;
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

  /**
   * History page. Default order is newest first; `afterSequence` returns the
   * messages after it oldest first (used to scroll down from an opened message).
   */
  getMessages: (conversationId: string, range: MessageRange, config?: AxiosRequestConfig) =>
    http.getCursorPage<
      ChatMessage,
      {
        conversationId: string;
        cursor?: string;
        pageSize: number;
        maxSequence?: string;
        afterSequence?: string;
      }
    >(CHAT_API_ROUTES.MESSAGES, { conversationId, pageSize: CHAT_HISTORY_PAGE_SIZE, ...range }, config),

  searchMessages: (conversationId: string, q: string, cursor?: string, config?: AxiosRequestConfig) =>
    http.getCursorPage<
      ChatMessageSearchResult,
      { conversationId: string; q: string; cursor?: string; pageSize: number }
    >(CHAT_API_ROUTES.MESSAGE_SEARCH, { conversationId, q, cursor, pageSize: CHAT_MESSAGE_SEARCH_PAGE_SIZE }, config),

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

  sendMessage: (body: SendMessageRequest, config?: AxiosRequestConfig) =>
    http.post<SentMessage>(CHAT_API_ROUTES.MESSAGES, body, config),

  sendReminder: (conversationId: string, body: { templateType: 'invoice' | 'contract_expiring'; resourceId: string; clientMessageId: string }) =>
    http.post<SentMessage>(CHAT_API_ROUTES.BOT_REMINDERS(conversationId), body),

  markRead: (conversationId: string, lastReadSequence: string) =>
    http.post<{ conversationId: string; unreadCount: number }>(CHAT_API_ROUTES.MARK_READ, {
      conversationId,
      lastReadSequence,
    }),

  updateConversation: (id: string, body: UpdateConversationMetadataRequest) =>
    http.patch<ConversationMetadataResponse>(CHAT_API_ROUTES.CONVERSATION(id), body),

  addMembers: (id: string, body: AddConversationMembersRequest) =>
    http.post<ConversationMember[]>(CHAT_API_ROUTES.MEMBERS(id), body),

  updateMemberRole: (conversationId: string, userId: string, body: UpdateConversationMemberRoleRequest) =>
    http.put<void>(CHAT_API_ROUTES.MEMBER_ROLE(conversationId, userId), body),

  removeMember: (conversationId: string, userId: string) =>
    http.delete<void>(CHAT_API_ROUTES.MEMBER(conversationId, userId)),

  leaveConversation: (id: string) => http.delete<void>(CHAT_API_ROUTES.LEAVE(id)),
};

export type ConversationListPage = Paginated<ConversationSummary>;
export type ChatHistoryPage = MessagePage;
