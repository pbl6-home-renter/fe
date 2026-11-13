import { useTranslation } from 'react-i18next';
import { AlertCircle, Reply } from 'lucide-react';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';
import { cn } from '@/lib/utils/cn';
import type { ChatMessage, ChatReplyReference } from '../types/chat.dto';
import type { PendingMessage } from '../hooks/use-chat-composer';
import { formatChatMessage } from '../utils/format-chat-message';
import { isSameCluster } from '../utils/chat-message-cluster';
import { ChatAttachment } from './chat-attachment';
import { ChatReadReceipt, type ChatReader } from './chat-read-receipt';

type ChatMessageItemProps =
  | {
      kind: 'message';
      message: ChatMessage;
      previousMessage?: ChatMessage;
      nextMessage?: ChatMessage;
      currentUserId?: string;
      isGroup: boolean;
      highlighted?: boolean;
      animateEntry?: boolean;
      onReply?: (reply: ChatReplyReference) => void;
      onJumpToMessage?: (id: string, sequence?: string) => void;
      readReceipt?: { isGroup: boolean; readers: ChatReader[]; totalRecipients: number };
    }
  | {
      kind: 'pending';
      pending: PendingMessage;
      onRetry: (message: PendingMessage) => void;
    };

const useLocale = () => {
  const { i18n } = useTranslation('chat');
  return i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
};

/** Bubble corners: the side facing the sender tightens between messages of one cluster. */
const bubbleCorners = (isOwn: boolean, startsCluster: boolean, endsCluster: boolean) =>
  cn(
    'rounded-[18px]',
    isOwn ? !startsCluster && 'rounded-tr-md' : !startsCluster && 'rounded-tl-md',
    isOwn ? !endsCluster && 'rounded-br-md' : !endsCluster && 'rounded-bl-md',
  );

const bubbleTone = (isOwn: boolean) =>
  isOwn
    ? 'bg-rentify-primary text-white'
    : 'bg-rentify-surface text-rentify-text-primary shadow-[0_1px_2px_rgba(20,42,76,0.08)] ring-1 ring-rentify-divider/60';

export const ChatMessageItem = (props: ChatMessageItemProps) =>
  props.kind === 'pending' ? <PendingMessageItem {...props} /> : <PersistedMessageItem {...props} />;

const PersistedMessageItem = (props: Extract<ChatMessageItemProps, { kind: 'message' }>) => {
  const { t } = useTranslation('chat');
  const locale = useLocale();
  const { message, currentUserId } = props;
  const time = new Date(message.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const fullTime = new Date(message.createdAt).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (message.type === 'system') {
    return (
      <div className="my-4 flex justify-center px-6" title={fullTime}>
        <span className="max-w-full rounded-full bg-rentify-surface-container-low px-3 py-1 text-center text-xs text-rentify-text-secondary">
          {formatChatMessage(message, t)}
        </span>
      </div>
    );
  }

  const isOwn = message.senderUserId === currentUserId;
  const startsCluster = !isSameCluster(props.previousMessage, message);
  const endsCluster = !isSameCluster(message, props.nextMessage);
  const corners = bubbleCorners(isOwn, startsCluster, endsCluster);
  const showName = props.isGroup && !isOwn && startsCluster;
  const hasImage = (message.type === 'image' || message.type === 'video' || message.type === 'file') && Boolean(message.mediaId);
  const text = hasImage ? message.content : formatChatMessage(message, t);

  const reply = () =>
    props.onReply?.({
      id: message.id,
      sequence: message.sequence,
      senderName: message.senderName,
      type: message.type,
      contentPreview: message.type === 'image' ? message.content || null : (message.content?.slice(0, 120) ?? null),
      isUnavailable: false,
    });

  return (
    <div
      id={`chat-message-${message.id}`}
      tabIndex={props.highlighted ? -1 : undefined}
      className={cn(
        'group flex w-full items-end gap-2 outline-none',
        isOwn ? 'justify-end' : 'justify-start',
        endsCluster ? 'mb-3' : 'mb-0.5',
        startsCluster && 'mt-1',
        props.animateEntry && 'chat-message-in',
      )}
    >
      {!isOwn && (
        <div className="mb-5 w-8 shrink-0">{endsCluster && <UserAvatar name={message.senderName} size="sm" />}</div>
      )}
      <div className={cn('flex min-w-0 max-w-[min(36rem,78%)] flex-col', isOwn ? 'items-end' : 'items-start')}>
        {showName && (
          <span className="mb-1 max-w-full truncate px-3 text-xs font-medium text-rentify-text-secondary">
            {message.senderName}
          </span>
        )}
        {message.replyTo && (
          <ReplyQuote
            reply={message.replyTo}
            isOwn={isOwn}
            onJump={() => props.onJumpToMessage?.(message.replyTo!.id, message.replyTo!.sequence ?? undefined)}
          />
        )}
        <div className={cn('flex max-w-full items-center gap-1', isOwn && 'flex-row-reverse')}>
          <div
            title={fullTime}
            className={cn(
              'relative z-[1] flex min-w-0 flex-col gap-0.5',
              isOwn ? 'items-end' : 'items-start',
              props.highlighted && cn('chat-message-highlight', corners),
            )}
          >
            {hasImage && message.type !== 'text' && message.type !== 'bot' && <ChatAttachment type={message.type} mediaId={message.mediaId!} className={corners} />}
            {text && (
              <p
                className={cn(
                  'max-w-full whitespace-pre-wrap break-words px-3.5 py-2 text-[15px] leading-snug',
                  corners,
                  bubbleTone(isOwn),
                )}
              >
                {text}
              </p>
            )}
          </div>
          {props.onReply && (
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t('reply')}
              title={t('reply')}
              className="shrink-0 rounded-full text-rentify-neutral opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
              onClick={reply}
            >
              <Reply className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          )}
        </div>
        {endsCluster && (
          <time dateTime={message.createdAt} className="mt-1 px-1 text-[11px] text-rentify-neutral">
            {time}
          </time>
        )}
        {props.readReceipt && <ChatReadReceipt {...props.readReceipt} />}
      </div>
    </div>
  );
};

const ReplyQuote = ({ reply, isOwn, onJump }: { reply: ChatReplyReference; isOwn: boolean; onJump: () => void }) => {
  const { t } = useTranslation('chat');
  const preview = reply.isUnavailable ? t('replyUnavailable') : reply.contentPreview || t(reply.type === 'video' ? 'videoSent' : reply.type === 'file' ? 'fileSent' : 'photoSent');
  return (
    <button
      type="button"
      disabled={reply.isUnavailable}
      onClick={onJump}
      className={cn(
        'ui-press -mb-3 flex max-w-full flex-col rounded-[18px] px-3.5 pb-4 pt-2 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary enabled:cursor-pointer enabled:hover:brightness-[0.97] disabled:cursor-default',
        isOwn ? 'items-end bg-rentify-primary-container' : 'items-start bg-rentify-surface-container-low',
      )}
    >
      <span className="mb-0.5 flex items-center gap-1 text-[11px] text-rentify-text-secondary">
        <Reply className="h-3 w-3" aria-hidden="true" />
        {t('repliedTo', { name: reply.senderName ?? t('replyUnavailableShort') })}
      </span>
      <span className={cn('line-clamp-2 text-rentify-text-secondary', reply.isUnavailable && 'italic')}>{preview}</span>
    </button>
  );
};

const PendingMessageItem = ({ pending, onRetry }: Extract<ChatMessageItemProps, { kind: 'pending' }>) => {
  const { t } = useTranslation('chat');
  const failed = pending.status !== 'uploading' && pending.status !== 'sending';
  return (
    <div className="chat-message-in mb-3 flex w-full justify-end">
      <div className="flex max-w-[min(36rem,78%)] flex-col items-end gap-0.5">
        {pending.replyTo && (
          <span className="-mb-3 flex max-w-full flex-col items-end rounded-[18px] bg-rentify-primary-container px-3.5 pb-4 pt-2 text-xs text-rentify-text-secondary">
            <span className="text-[11px]">
              {t('repliedTo', { name: pending.replyTo.senderName ?? t('replyUnavailableShort') })}
            </span>
            <span className="line-clamp-2">{pending.replyTo.contentPreview || t(pending.replyTo.type === 'video' ? 'videoSent' : pending.replyTo.type === 'file' ? 'fileSent' : 'photoSent')}</span>
          </span>
        )}
        {pending.type !== 'text' && pending.imageFile && <ChatAttachment type={pending.type} file={pending.imageFile} />}
        {pending.content && (
          <p
            className={cn(
              'relative z-[1] max-w-full whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2 text-[15px] leading-snug text-white',
              failed ? 'bg-rentify-error/85' : 'bg-rentify-primary/70',
            )}
          >
            {pending.content}
          </p>
        )}
        {pending.status === 'uploading' && (
          <div className="w-48">
            <ProgressMeterTrack value={pending.uploadProgress ?? 0} label={t('uploadingFile')} showValue />
          </div>
        )}
        <div
          className={cn(
            'mt-1 flex items-center gap-2 px-1 text-[11px]',
            failed ? 'text-rentify-error' : 'text-rentify-neutral',
          )}
        >
          {failed && <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />}
          {pending.status === 'uploading'
            ? t('uploadingFile')
            : pending.status === 'sending'
              ? t('sending')
              : t('sendFailed')}
          {pending.canRetry && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRetry(pending)}
              className="h-auto min-h-0 p-0 text-[11px] font-semibold text-rentify-primary hover:bg-transparent"
            >
              {t('retry')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
