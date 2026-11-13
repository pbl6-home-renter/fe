import type { TFunction } from 'i18next';
import type { ChatMessage, LastMessage } from '../types/chat.dto';

type ChatMessagePreviewSource =
  Pick<ChatMessage, 'type' | 'content' | 'payload'> | Pick<LastMessage, 'type' | 'contentPreview' | 'payload'>;

export const formatChatMessage = (message: ChatMessagePreviewSource, t: TFunction<'chat'>): string => {
  if (message.type === 'image') return t('photoSent');
  if (message.type === 'video') return t('videoSent');
  if (message.type === 'file') return t('fileSent');
  if (message.type !== 'system' || !message.payload) {
    return 'contentPreview' in message ? message.contentPreview : (message.content ?? '');
  }

  const payload = message.payload;
  const actor = payload.actorDisplayName?.trim() || t('system.unknownActor');
  switch (payload.action) {
    case 'members_added':
      return t('system.members_added', {
        actor,
        members: payload.members.map((member) => member.displayName).join(', '),
      });
    case 'member_kicked':
      return t('system.member_kicked', { actor, member: payload.member.displayName });
    case 'member_left':
      return t('system.member_left', { actor, member: payload.member.displayName });
    case 'admin_transferred':
      return t('system.admin_transferred', { actor, member: payload.member.displayName });
    case 'member_role_changed':
      return t('system.member_role_changed', {
        actor,
        member: payload.member.displayName,
        oldRole: t(`system.${payload.oldRole}`),
        newRole: t(`system.${payload.newRole}`),
      });
    case 'conversation_title_changed':
      return t('system.conversation_title_changed', { actor, title: payload.newTitle ?? t('groupDefault') });
    case 'conversation_avatar_changed':
      return t('system.conversation_avatar_changed', { actor });
  }
};
