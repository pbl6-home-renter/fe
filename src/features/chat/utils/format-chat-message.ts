import type { TFunction } from 'i18next';
import type { ChatMessage, LastMessage } from '../types/chat.dto';
import { BOT_REMINDER_MESSAGE_CODE, BOT_REMINDER_PREVIEW_FALLBACK } from '../constants/chat.constants';
import { formatDate, formatMonth } from '@/lib/utils/format';
import { i18n } from '@/i18n/i18n';

type ChatMessagePreviewSource =
  Pick<ChatMessage, 'type' | 'content' | 'payload'> | Pick<LastMessage, 'type' | 'contentPreview' | 'payload'>;

export const formatChatMessage = (message: ChatMessagePreviewSource, t: TFunction<'chat'>): string => {
  if (message.type === 'image') return t('photoSent');
  if (message.type === 'video') return t('videoSent');
  if (message.type === 'file') return t('fileSent');
  if (message.type === 'bot' && message.payload?.action === 'bot_reminder') {
    const reminder = message.payload;
    if (reminder.messageCode === BOT_REMINDER_MESSAGE_CODE.INVOICE_ISSUED) {
      const { invoiceCode, period, totalAmount } = reminder.parameters;
      const [whole, fraction] = totalAmount.split('.');
      const english = i18n.language.startsWith('en');
      const amount = whole.replace(/\B(?=(\d{3})+(?!\d))/g, english ? ',' : '.') +
        (fraction && /[1-9]/.test(fraction) ? `${english ? '.' : ','}${fraction}` : '');
      return t('reminder.messages.BOT_REMINDER_INVOICE_ISSUED', { invoiceCode, period: formatMonth(period), amount });
    }
    if (reminder.messageCode === BOT_REMINDER_MESSAGE_CODE.CONTRACT_END_DATE) {
      return t('reminder.messages.BOT_REMINDER_CONTRACT_END_DATE', { endDate: formatDate(reminder.parameters.endDate) });
    }
    return 'contentPreview' in message ? message.contentPreview : (message.content ?? '');
  }
  if (message.type !== 'system' || !message.payload || message.payload.action === 'bot_reminder') {
    const text = 'contentPreview' in message ? message.contentPreview : (message.content ?? '');
    return message.type === 'bot' ? formatBotReminderPreview(text, t) : text;
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

export const formatBotReminderPreview = (text: string, t: TFunction<'chat'>): string => {
  if (text === BOT_REMINDER_PREVIEW_FALLBACK) return t('reminder.previews.generic');
  if (text === BOT_REMINDER_MESSAGE_CODE.INVOICE_ISSUED) return t('reminder.previews.BOT_REMINDER_INVOICE_ISSUED');
  if (text === BOT_REMINDER_MESSAGE_CODE.CONTRACT_END_DATE) return t('reminder.previews.BOT_REMINDER_CONTRACT_END_DATE');
  return text;
};
