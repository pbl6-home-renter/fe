import type { BaseEntity, CursorPaginationMeta, PaginationMeta } from '@/types/api';

export type ConversationKind = 'direct' | 'group';
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'system' | 'bot';
export interface ChatReplyReference {
  id: string;
  sequence?: string | null;
  senderName: string | null;
  type: MessageType | null;
  contentPreview: string | null;
  isUnavailable: boolean;
}

export interface ChatMessageSearchResult {
  id: string;
  sequence: string;
  senderName: string;
  type: MessageType;
  contentPreview: string;
  createdAt: string;
}
export type MemberStatus = 'active' | 'read_only';
export type SystemMessageAction =
  | 'members_added'
  | 'member_kicked'
  | 'member_left'
  | 'admin_transferred'
  | 'member_role_changed'
  | 'conversation_title_changed'
  | 'conversation_avatar_changed';

interface SystemMessageBase {
  actorUserId: string;
  actorDisplayName: string;
}

export type SystemMessagePayload =
  | (SystemMessageBase & {
      action: 'members_added';
      members: Array<{ userId: string; displayName: string }>;
    })
  | (SystemMessageBase & {
      action: 'member_kicked' | 'member_left' | 'admin_transferred';
      member: { userId: string; displayName: string };
    })
  | (SystemMessageBase & {
      action: 'member_role_changed';
      member: { userId: string; displayName: string };
      oldRole: 'admin' | 'member';
      newRole: 'admin' | 'member';
    })
  | (SystemMessageBase & {
      action: 'conversation_title_changed';
      oldTitle: string | null;
      newTitle: string | null;
    })
  | (SystemMessageBase & {
      action: 'conversation_avatar_changed';
      oldAvatarMediaId: string | null;
      newAvatarMediaId: string | null;
    });

export interface BotReminderPayload {
  action: 'bot_reminder';
  actorUserId: string;
  templateType: 'invoice' | 'contract_expiring';
  resourceId: string;
}

export interface ChatMessage extends BaseEntity {
  conversationId: string;
  senderUserId: string | null;
  senderName: string;
  /** Sender's current avatar; absent on messages built locally or pushed over the socket. */
  senderAvatarUrl?: string | null;
  senderType: 'user' | 'system';
  sequence: string;
  clientMessageId: string | null;
  type: MessageType;
  content: string | null;
  mediaId: string | null;
  payload: SystemMessagePayload | BotReminderPayload | null;
  replyTo?: ChatReplyReference | null;
  createdAt: string;
}

export interface LastMessage {
  id: string;
  sequence: string;
  senderName: string;
  contentPreview: string;
  type: MessageType;
  sentAt: string;
  payload: SystemMessagePayload | BotReminderPayload | null;
}

export interface ConversationSummary extends BaseEntity {
  kind: ConversationKind;
  contextType: 'contract' | 'building' | null;
  contextId: string | null;
  title: string | null;
  displayName: string | null;
  avatarMediaId: string | null;
  /** Group: private media path of the group photo. Direct: the other person's avatar. */
  avatarUrl?: string | null;
  unreadCount: number;
  lastMessage: LastMessage | null;
  memberCount?: number;
}

export interface ConversationMember extends BaseEntity {
  conversationId: string;
  userId: string | null;
  displayName: string;
  avatarUrl?: string | null;
  participantType: 'user' | 'system';
  role: 'admin' | 'member' | 'system';
  status: MemberStatus;
  lastReadSequence: string;
  leftSequence: string | null;
  joinedAt: string;
  leftAt: string | null;
}

export interface UpdateConversationMetadataRequest {
  title?: string | null;
  avatarMediaId?: string | null;
}

export interface ConversationMetadataResponse {
  id: string;
  kind: ConversationKind;
  contextType: 'contract' | 'building' | null;
  contextId: string | null;
  title: string | null;
  avatarMediaId: string | null;
}

export interface AddConversationMembersRequest {
  userIds: string[];
}

export interface UpdateConversationMemberRoleRequest {
  role: 'admin' | 'member';
}

export interface SentMessage {
  id: string;
  conversationId: string;
  senderName: string;
  type: MessageType;
  content: string | null;
  mediaId: string | null;
  sequence: string;
  clientMessageId: string | null;
  createdAt: string;
  replyTo?: ChatReplyReference | null;
}

export interface ConversationDetail extends Omit<ConversationSummary, 'lastMessage'> {
  members: ConversationMember[];
}

export interface UserDirectoryEntry {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface UserDirectoryPage {
  items: UserDirectoryEntry[];
  pagination: PaginationMeta;
}

export interface MessagePage {
  items: ChatMessage[];
  pagination: CursorPaginationMeta;
}

export interface CreateGroupRequest {
  kind: 'group';
  memberUserIds: string[];
  title?: string;
}

export interface CreateDirectRequest {
  kind: 'direct';
  recipientUserId: string;
}

export interface SendTextMessageRequest {
  conversationId: string;
  clientMessageId: string;
  type: 'text';
  content: string;
  replyToMessageId?: string;
}

export interface SendImageMessageRequest {
  conversationId: string;
  clientMessageId: string;
  type: 'image' | 'video' | 'file';
  content?: string | null;
  mediaId: string;
  replyToMessageId?: string;
}

export type SendMessageRequest = SendTextMessageRequest | SendImageMessageRequest;

export interface UnreadSummary {
  totalUnreadCount: number;
}

export interface SendMessageEvent {
  conversationId: string;
  messageId: string;
  sequence: string;
  senderUserId: string | null;
  senderName: string;
  senderAvatarUrl?: string | null;
  conversationName: string | null;
  type: 'text' | 'image' | 'video' | 'file' | 'bot';
  contentPreview: string;
  createdAt: string;
}
