import { useTranslation } from 'react-i18next';
import type { ChatMessage, ChatReplyReference } from '../types/chat.dto';
import { ChatImage } from './chat-image';
import { formatChatMessage } from '../utils/format-chat-message';
import type { PendingMessage } from '../hooks/use-chat-composer';
import { Button } from '@/components/ui/button';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';
import { useChatLocalImagePreview } from '../hooks/use-chat-local-image-preview';
import { Reply } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { ChatReadReceipt } from './chat-read-receipt';

type ChatMessageItemProps =
  | {
      kind: 'message';
      message: ChatMessage;
      previousMessage?: ChatMessage;
      currentUserId?: string;
      showSenderName: boolean;
      highlighted?: boolean;
      animateEntry?: boolean;
      onReply?: (reply: ChatReplyReference) => void;
      onJumpToMessage?: (id: string, sequence?: string) => void;
      readReceipt?: { isGroup: boolean; readers: Array<{ id: string; name: string }>; totalRecipients: number };
    }
  | {
      kind: 'pending';
      pending: PendingMessage;
      onRetry: (message: PendingMessage) => void;
    };

const formatTime = (value: string, locale: string) =>
  new Date(value).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

export const ChatMessageItem = (props: ChatMessageItemProps) => {
  const { t, i18n } = useTranslation('chat');
  const pendingImageUrl = useChatLocalImagePreview(props.kind === 'pending' ? props.pending.imageFile : undefined);
  if (props.kind === 'pending') {
    const { pending } = props;
    return (
      <div className="chat-message-in mb-3 flex justify-end">
        <div className="max-w-[78%] rounded-2xl bg-rentify-primary-container px-4 py-2.5 shadow-sm">
          {pending.replyTo && (
            <div className="mb-2 border-l-2 border-rentify-primary pl-2 text-xs">
              <p className="font-semibold">{pending.replyTo.senderName ?? t('replyUnavailable')}</p>
              <p className="truncate text-rentify-text-secondary">{pending.replyTo.contentPreview || t('photoSent')}</p>
            </div>
          )}
          {pending.type === 'image' && pendingImageUrl && (
            <img src={pendingImageUrl} alt={t('photoSent')} className="max-h-72 max-w-72 rounded-xl object-cover" />
          )}
          {pending.content && <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm">{pending.content}</p>}
          {pending.status === 'uploading' && (
            <ProgressMeterTrack value={pending.uploadProgress ?? 0} label={t('uploadingImage')} showValue />
          )}
          <div className="mt-1 flex items-center justify-end gap-2 text-xs text-rentify-text-secondary">
            {pending.status === 'uploading'
              ? t('uploadingImage')
              : pending.status === 'sending'
                ? t('sending')
                : t('sendFailed')}
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
  const time = formatTime(message.createdAt, locale);
  const isSystemMessage = message.type === 'system';
  const sameSender =
    previousMessage?.senderUserId === message.senderUserId &&
    previousMessage.senderType === message.senderType &&
    previousMessage.senderName === message.senderName &&
    previousMessage.type !== 'system' &&
    new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60_000 &&
    new Date(message.createdAt).toDateString() === new Date(previousMessage.createdAt).toDateString();
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
          <MessageTime time={time} />
        </div>
      </div>
    );
  }

  return (
    <div
      id={`chat-message-${message.id}`}
      tabIndex={props.highlighted ? -1 : undefined}
      className={`group flex flex-col ${props.animateEntry ? 'chat-message-in' : ''} ${sameSender ? 'mb-1' : 'mb-3'} ${isOwnMessage ? 'items-end' : 'items-start'}`}
    >
      <div className={`flex max-w-full items-end gap-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        <div
          className={`max-w-[78vw] rounded-2xl px-4 py-2.5 shadow-sm md:max-w-[36rem] ${props.highlighted ? 'ring-2 ring-rentify-primary' : ''} ${isOwnMessage ? 'bg-rentify-primary-container text-rentify-on-primary-container' : 'bg-rentify-surface'}`}
        >
          {showSender && (
            <div className="mb-1 text-[11px] font-semibold text-rentify-primary">{message.senderName}</div>
          )}
          {message.replyTo && (
            <Button
              type="button"
              variant="ghost"
              disabled={message.replyTo.isUnavailable}
              className="mb-2 h-auto min-h-10 w-full justify-start border-l-2 border-rentify-primary bg-rentify-background px-2 py-1 text-left"
              onClick={() => props.onJumpToMessage?.(message.replyTo!.id, message.replyTo!.sequence ?? undefined)}
            >
              <span className="min-w-0 text-xs">
                <span className="block truncate font-semibold">
                  {message.replyTo.senderName ?? t('replyUnavailable')}
                </span>
                <span className="block truncate text-rentify-text-secondary">
                  {message.replyTo.isUnavailable
                    ? t('replyUnavailable')
                    : message.replyTo.contentPreview || t('photoSent')}
                </span>
              </span>
            </Button>
          )}
          {message.type === 'image' && message.mediaId ? (
            <>
              <ChatImage mediaId={message.mediaId} />
              {message.content && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{message.content}</p>}
            </>
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
          )}
          <MessageTime time={time} />
        </div>
        {props.onReply && (
          <IconButton
            type="button"
            variant="ghost"
            aria-label={t('reply')}
            className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            onClick={() =>
              props.onReply?.({
                id: message.id,
                sequence: message.sequence,
                senderName: message.senderName,
                type: message.type,
                contentPreview:
                  message.type === 'image' ? message.content || null : (message.content?.slice(0, 120) ?? null),
                isUnavailable: false,
              })
            }
          >
            <Reply className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        )}
      </div>
      {props.readReceipt && <ChatReadReceipt {...props.readReceipt} />}
    </div>
  );
};

const MessageTime = ({ time }: { time: string }) => (
  <time className="mt-1 block text-right text-xs text-rentify-text-secondary">{time}</time>
);
