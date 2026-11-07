import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../types/chat.dto';
import { ChatImage } from './chat-image';
import { formatChatMessage } from '../utils/format-chat-message';
import type { PendingMessage } from '../hooks/use-chat-composer';
import { Button } from '@/components/ui/button';

type ChatMessageItemProps =
  | {
      kind: 'message';
      message: ChatMessage;
      previousMessage?: ChatMessage;
      currentUserId?: string;
      showSenderName: boolean;
    }
  | {
      kind: 'pending';
      pending: PendingMessage;
      onRetry: (message: PendingMessage) => void;
    };

const formatDateTime = (value: string, locale: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString(locale),
    time: date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
};

export const ChatMessageItem = (props: ChatMessageItemProps) => {
  const { t, i18n } = useTranslation('chat');
  if (props.kind === 'pending') {
    const { pending } = props;
    return (
      <div className="mb-3 flex justify-end">
        <div className="max-w-[78%] rounded-2xl bg-rentify-primary/10 px-4 py-2.5 shadow-sm">
          <p className="whitespace-pre-wrap wrap-break-word text-sm">{pending.content}</p>
          <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-rentify-neutral">
            {pending.status === 'sending' ? t('sending') : t('sendFailed')}
            {pending.canRetry && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => props.onRetry(pending)}
                className="h-auto min-h-0 p-0 font-semibold text-rentify-primary"
              >
                {t('retry')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { message, previousMessage, currentUserId, showSenderName } = props;
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
  const dateTime = formatDateTime(message.createdAt, locale);
  const isSystemMessage = message.type === 'system';
  const sameSender =
    previousMessage?.senderUserId === message.senderUserId &&
    previousMessage.senderType === message.senderType &&
    previousMessage.senderName === message.senderName &&
    previousMessage.type !== 'system';
  const showSender = showSenderName && !isSystemMessage && !sameSender;
  const isOwnMessage = message.senderUserId === currentUserId;
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
    <div className={`mb-3 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${isOwnMessage ? 'bg-rentify-primary/10' : 'bg-rentify-surface'}`}
      >
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
