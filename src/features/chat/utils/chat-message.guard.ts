import type { ChatMessage, ChatReplyReference, SendMessageEvent, SystemMessagePayload } from '../types/chat.dto';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isConversationSocketEvent = (value: unknown): value is { conversationId: string } =>
  isRecord(value) && typeof value.conversationId === 'string';

const isStringOrNull = (value: unknown): value is string | null => value === null || typeof value === 'string';

const isReplyReference = (value: unknown): value is ChatReplyReference =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  (value.sequence === undefined ||
    value.sequence === null ||
    (typeof value.sequence === 'string' && /^\d+$/.test(value.sequence))) &&
  isStringOrNull(value.senderName) &&
  (value.type === null || value.type === 'text' || value.type === 'image' || value.type === 'bot') &&
  isStringOrNull(value.contentPreview) &&
  typeof value.isUnavailable === 'boolean';

const isMemberSnapshot = (value: unknown): value is { userId: string; displayName: string } =>
  isRecord(value) && typeof value.userId === 'string' && typeof value.displayName === 'string';

export const isSystemMessagePayload = (value: unknown): value is SystemMessagePayload => {
  if (!isRecord(value) || typeof value.actorUserId !== 'string' || typeof value.actorDisplayName !== 'string')
    return false;
  switch (value.action) {
    case 'members_added':
      return Array.isArray(value.members) && value.members.every(isMemberSnapshot);
    case 'member_kicked':
    case 'member_left':
    case 'admin_transferred':
      return isMemberSnapshot(value.member);
    case 'member_role_changed':
      return (
        isMemberSnapshot(value.member) &&
        (value.oldRole === 'admin' || value.oldRole === 'member') &&
        (value.newRole === 'admin' || value.newRole === 'member')
      );
    case 'conversation_title_changed':
      return isStringOrNull(value.oldTitle) && isStringOrNull(value.newTitle);
    case 'conversation_avatar_changed':
      return isStringOrNull(value.oldAvatarMediaId) && isStringOrNull(value.newAvatarMediaId);
    default:
      return false;
  }
};

export const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!isRecord(value)) return false;
  const payloadValid = value.payload === null || isSystemMessagePayload(value.payload);
  const replyValid = value.replyTo === undefined || value.replyTo === null || isReplyReference(value.replyTo);
  return (
    typeof value.id === 'string' &&
    typeof value.conversationId === 'string' &&
    typeof value.sequence === 'string' &&
    /^\d+$/.test(value.sequence) &&
    (value.type === 'text' || value.type === 'image' || value.type === 'system' || value.type === 'bot') &&
    typeof value.senderName === 'string' &&
    typeof value.createdAt === 'string' &&
    (typeof value.senderUserId === 'string' || value.senderUserId === null) &&
    (value.senderType === 'user' || value.senderType === 'system') &&
    isStringOrNull(value.content) &&
    isStringOrNull(value.mediaId) &&
    isStringOrNull(value.clientMessageId) &&
    payloadValid &&
    replyValid
  );
};

export const isMemberReadEvent = (
  value: unknown,
): value is { conversationId: string; userId: string; lastReadSequence: string } =>
  isRecord(value) &&
  typeof value.conversationId === 'string' &&
  typeof value.userId === 'string' &&
  typeof value.lastReadSequence === 'string' &&
  /^\d+$/.test(value.lastReadSequence);

export const isTypingEvent = (value: unknown): value is { conversationId: string; userId: string; isTyping: boolean } =>
  isRecord(value) &&
  typeof value.conversationId === 'string' &&
  typeof value.userId === 'string' &&
  typeof value.isTyping === 'boolean';

export const parseChatMessage = (value: unknown): ChatMessage | undefined => {
  if (isChatMessage(value)) return value;
  if (
    !isRecord(value) ||
    value.type !== 'system' ||
    !isRecord(value.payload) ||
    typeof value.payload.actorUserId !== 'string' ||
    typeof value.payload.actorDisplayName !== 'undefined'
  )
    return undefined;

  const normalized = {
    ...value,
    payload: { ...value.payload, actorDisplayName: '' },
  };
  return isChatMessage(normalized) ? normalized : undefined;
};

export const isSendMessageEvent = (value: unknown): value is SendMessageEvent => {
  if (!isRecord(value)) return false;
  return (
    typeof value.conversationId === 'string' &&
    typeof value.messageId === 'string' &&
    typeof value.senderName === 'string' &&
    (typeof value.conversationName === 'string' || value.conversationName === null) &&
    typeof value.contentPreview === 'string' &&
    typeof value.sequence === 'string' &&
    /^\d+$/.test(value.sequence) &&
    typeof value.createdAt === 'string' &&
    (typeof value.senderUserId === 'string' || value.senderUserId === null) &&
    (value.type === 'text' || value.type === 'image' || value.type === 'bot')
  );
};
