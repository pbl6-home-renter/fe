import { useTranslation } from 'react-i18next';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import type { ChatMessage, ChatReplyReference, ConversationMember } from '../types/chat.dto';
import type { PendingMessage } from '../hooks/use-chat-composer';
import { useChatMessageFeed } from '../hooks/use-chat-message-feed';
import { ChatMessageItem } from './chat-message-item';

interface ChatMessageFeedProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isError: boolean;
  isOlderError: boolean;
  onRetry: () => void;
  onLoadOlder: () => void;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  latestSequence?: string;
  onLatestVisible: () => void;
  newMessageCount: number;
  pending: PendingMessage[];
  onRetryPending: (item: PendingMessage) => void;
  onAtBottomChange: (atBottom: boolean) => void;
  currentUserId?: string;
  liveMessageIds: Set<string>;
  isGroup: boolean;
  members?: ConversationMember[];
  highlightedMessageId?: string;
  isAnchored?: boolean;
  hasNewer?: boolean;
  isLoadingNewer?: boolean;
  onLoadNewer?: () => void;
  onBackToLatest?: (glide: boolean) => void;
  onReply?: (reply: ChatReplyReference) => void;
  onJumpToMessage?: (id: string, sequence?: string) => void;
}

export const ChatMessageFeed = (props: ChatMessageFeedProps) => {
  const { t, i18n } = useTranslation('chat');
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
  const { feedRef, handleScroll, loadOlder, jumpLatest, backToLatest } = useChatMessageFeed({
    messageCount: props.messages.length,
    pendingCount: props.pending.length,
    isError: props.isError,
    isLoadingOlder: props.isLoadingOlder,
    hasOlder: props.hasOlder,
    onLoadOlder: props.onLoadOlder,
    onLatestVisible: props.onLatestVisible,
    onAtBottomChange: props.onAtBottomChange,
    highlightedMessageId: props.highlightedMessageId,
    isAnchored: props.isAnchored,
    hasNewer: props.hasNewer,
    isLoadingNewer: props.isLoadingNewer,
    onLoadNewer: props.onLoadNewer,
    onBackToLatest: props.onBackToLatest,
  });
  const persistedClientMessageIds = new Set(
    props.messages.map((message) => message.clientMessageId).filter((id): id is string => id !== null),
  );
  const pending = props.pending.filter((message) => !persistedClientMessageIds.has(message.clientMessageId));
  const lastOwnMessageId = [...props.messages]
    .reverse()
    .find((message) => message.senderUserId === props.currentUserId && message.type !== 'system')?.id;
  const activeOthers =
    props.members?.filter(
      (member) => member.status === 'active' && member.userId && member.userId !== props.currentUserId,
    ) ?? [];
  // Members carry each sender's current avatar, including for messages pushed over the socket.
  const avatarByUserId = new Map(
    (props.members ?? []).flatMap((member) =>
      member.userId && member.avatarUrl ? [[member.userId, member.avatarUrl] as const] : [],
    ),
  );
  const showReceipts = !props.isAnchored && !props.hasNewer;
  const isEmpty = !props.isLoading && !props.isError && props.messages.length === 0 && pending.length === 0;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={feedRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 md:px-5"
        aria-busy={props.isLoading || props.isLoadingOlder || props.isLoadingNewer}
      >
        {props.hasOlder && (
          <div className="flex justify-center pb-3">
            {props.isLoadingOlder ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadOlder}
                className="rounded-full text-xs text-rentify-primary"
              >
                {t('loadOlder')}
              </Button>
            )}
          </div>
        )}
        {props.isOlderError && <HistoryError onRetry={props.onRetry} />}
        {props.isLoading && <MessageSkeleton />}
        {props.isError && <HistoryError onRetry={props.onRetry} />}
        {isEmpty && <p className="py-10 text-center text-sm text-rentify-text-secondary">{t('emptyMessages')}</p>}
        {!props.isLoading &&
          props.messages.map((message, index) => {
            const previousMessage = props.messages[index - 1];
            const date = new Date(message.createdAt);
            const showDate =
              !previousMessage || date.toDateString() !== new Date(previousMessage.createdAt).toDateString();
            const isLastOwn = message.id === lastOwnMessageId && showReceipts;
            return (
              <div key={message.clientMessageId ?? message.id}>
                {showDate && <DateSeparator date={date} locale={locale} />}
                <ChatMessageItem
                  kind="message"
                  message={message}
                  senderAvatarUrl={
                    (message.senderUserId ? avatarByUserId.get(message.senderUserId) : undefined) ??
                    message.senderAvatarUrl
                  }
                  previousMessage={previousMessage}
                  nextMessage={props.messages[index + 1]}
                  currentUserId={props.currentUserId}
                  isGroup={props.isGroup}
                  highlighted={message.id === props.highlightedMessageId}
                  animateEntry={props.liveMessageIds.has(message.id)}
                  onReply={props.onReply}
                  onJumpToMessage={props.onJumpToMessage}
                  readReceipt={
                    isLastOwn
                      ? {
                          isGroup: props.isGroup,
                          readers: activeOthers
                            .filter((member) => BigInt(member.lastReadSequence) >= BigInt(message.sequence))
                            .map((member) => ({
                              id: member.userId!,
                              name: member.displayName,
                              avatarUrl: member.avatarUrl,
                            })),
                          totalRecipients: activeOthers.length,
                        }
                      : undefined
                  }
                />
              </div>
            );
          })}
        {pending.map((message) => (
          <ChatMessageItem
            key={message.clientMessageId}
            kind="pending"
            pending={message}
            onRetry={props.onRetryPending}
          />
        ))}
        {props.isLoadingNewer && (
          <div className="flex justify-center py-3">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {props.latestSequence && <span className="sr-only">{props.latestSequence}</span>}
      </div>
      {props.isAnchored ? (
        <FloatingAction label={t('backToLatest')} onClick={backToLatest} />
      ) : (
        props.newMessageCount > 0 && <FloatingAction label={t('newMessages')} onClick={jumpLatest} />
      )}
    </div>
  );
};

const FloatingAction = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
    <Button
      size="sm"
      onClick={onClick}
      className="chat-message-in pointer-events-auto rounded-full px-4 text-xs font-semibold shadow-lg"
    >
      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </Button>
  </div>
);

const DateSeparator = ({ date, locale }: { date: Date; locale: string }) => (
  <div className="my-5 flex items-center gap-3" role="separator">
    <span className="h-px flex-1 bg-rentify-divider/70" />
    <time
      dateTime={date.toISOString()}
      className="text-[11px] font-medium uppercase tracking-wide text-rentify-text-secondary"
    >
      {date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
    </time>
    <span className="h-px flex-1 bg-rentify-divider/70" />
  </div>
);

/** Alternating incoming/outgoing bubbles of varied width so loading looks like a conversation. */
const SKELETON_ROWS: Array<{ own: boolean; widths: string[] }> = [
  { own: false, widths: ['w-48', 'w-64'] },
  { own: true, widths: ['w-40'] },
  { own: false, widths: ['w-56'] },
  { own: true, widths: ['w-72', 'w-32'] },
  { own: false, widths: ['w-44'] },
  { own: true, widths: ['w-52'] },
];

const MessageSkeleton = () => {
  const { t } = useTranslation('chat');
  return (
    <div role="status" aria-label={t('loadingMessages')} className="space-y-4 py-2">
      {SKELETON_ROWS.map((row, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`flex items-end gap-2 ${row.own ? 'justify-end' : 'justify-start'}`}
        >
          {!row.own && <Skeleton variant="circular" className="h-8 w-8 shrink-0" />}
          <div className={`flex max-w-[78%] flex-col gap-1 ${row.own ? 'items-end' : 'items-start'}`}>
            {row.widths.map((width, line) => (
              <Skeleton key={line} className={`h-9 max-w-full rounded-[18px] ${width}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HistoryError = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation('chat');
  return (
    <div role="alert" className="py-8 text-center">
      <p className="mb-2 text-sm">{t('historyError')}</p>
      <Button variant="ghost" size="sm" onClick={onRetry} className="text-rentify-primary">
        {t('tryLoadAgain')}
      </Button>
    </div>
  );
};
