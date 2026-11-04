import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../types/chat.dto';
import { ChatImage } from './chat-image';
import { formatChatMessage } from '../utils/format-chat-message';

interface ChatMessageItemProps {
  message: ChatMessage;
  previousMessage?: ChatMessage;
  currentUserId?: string;
  showSenderName: boolean;
}

const formatDateTime = (value: string, locale: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString(locale),
    time: date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
};

export const ChatMessageItem = ({ message, previousMessage, currentUserId, showSenderName }: ChatMessageItemProps) => {
  const { t, i18n } = useTranslation('chat');
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
  const dateTime = formatDateTime(message.createdAt, locale);
  const isSystemMessage = message.type === 'system';
  const sameSender =
    previousMessage?.senderUserId === message.senderUserId &&
    previousMessage.senderType === message.senderType &&
    previousMessage.senderName === message.senderName &&
    previousMessage.type !== 'system';
  const showSender = showSenderName && !isSystemMessage && !sameSender;
  const content = formatChatMessage(message, t);

  if (isSystemMessage) {
    return (
      <div className="my-3 text-center">
        <div className="inline-flex flex-col items-center">
          <span className="rounded-full bg-rentify-background px-3 py-1 text-xs text-rentify-text-secondary">
            {content}
          </span>
          <MessageTime date={dateTime.date} time={dateTime.time} />
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-3 flex ${message.senderUserId === currentUserId ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[78%] rounded-2xl bg-rentify-surface px-4 py-2.5 shadow-sm">
        {showSender && <div className="mb-1 text-[11px] font-semibold text-rentify-primary">{message.senderName}</div>}
        {message.type === 'image' && message.mediaId ? (
          <ChatImage mediaId={message.mediaId} />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
        )}
        <MessageTime date={dateTime.date} time={dateTime.time} />
      </div>
    </div>
  );
};

const MessageTime = ({ date, time }: { date: string; time: string }) => {
  const { t } = useTranslation('chat');
  return (
    <time className="mt-1 block text-right text-[10px] text-rentify-neutral">{t('messageDate', { date, time })}</time>
  );
};
