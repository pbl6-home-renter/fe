import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
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
  showSenderNames: boolean;
  members?: ConversationMember[];
  highlightedMessageId?: string;
  isAnchored?: boolean;
  onBackToLatest?: () => void;
  onReply?: (reply: ChatReplyReference) => void;
  onJumpToMessage?: (id: string, sequence?: string) => void;
}

export const ChatMessageFeed = (props: ChatMessageFeedProps) => {
  const { t, i18n } = useTranslation('chat');
  const { feedRef, handleScroll, loadOlder, jumpLatest } = useChatMessageFeed({
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
  });
  const latestMessage = props.messages.at(-1);
  const persistedClientMessageIds = new Set(
    props.messages.map((message) => message.clientMessageId).filter((id): id is string => id !== null),
  );
  const feedItems = [
    ...(props.isLoading
      ? []
      : props.messages.map((message, index) => ({
          key: message.clientMessageId ?? message.id,
          kind: 'message' as const,
          message,
          previousMessage: props.messages[index - 1],
        }))),
    ...props.pending
      .filter((message) => !persistedClientMessageIds.has(message.clientMessageId))
      .map((message) => ({ key: message.clientMessageId, kind: 'pending' as const, message })),
  ];
  const lastOwnMessageId = [...props.messages]
    .reverse()
    .find((message) => message.senderUserId === props.currentUserId && message.type !== 'system')?.id;
  const activeOthers =
    props.members?.filter(
      (member) => member.status === 'active' && member.userId && member.userId !== props.currentUserId,
    ) ?? [];

  return (
    <div ref={feedRef} onScroll={handleScroll} className="relative min-h-0 flex-1 overflow-y-auto px-5 py-4">
      {props.hasOlder && (
        <Button
          variant="ghost"
          size="sm"
          onClick={loadOlder}
          disabled={props.isLoadingOlder}
          className="mx-auto mb-3 block text-xs text-rentify-primary"
        >
          {t('loadOlder')}
        </Button>
      )}
      {props.isOlderError && <HistoryError onRetry={props.onRetry} />}
      {props.isLoading && <MessageSkeleton />}
      {props.isError && <HistoryError onRetry={props.onRetry} />}
      {!props.isLoading && !props.isError && props.messages.length === 0 && props.pending.length === 0 && (
        <p className="py-8 text-center text-sm text-rentify-text-secondary">{t('emptyMessages')}</p>
      )}
      {feedItems.map((item) => {
        if (item.kind === 'pending') {
          return (
            <ChatMessageItem key={item.key} kind="pending" pending={item.message} onRetry={props.onRetryPending} />
          );
        }
        const date = new Date(item.message.createdAt);
        const previousDate = item.previousMessage ? new Date(item.previousMessage.createdAt) : undefined;
        const showDate = !previousDate || date.toDateString() !== previousDate.toDateString();
        const readers =
          item.message.id === lastOwnMessageId && !props.isAnchored
            ? activeOthers
                .filter((member) => BigInt(member.lastReadSequence) >= BigInt(item.message.sequence))
                .map((member) => ({ id: member.userId!, name: member.displayName }))
            : [];
        return (
          <div key={item.key}>
            {showDate && (
              <div className="my-4 text-center">
                <time className="rounded-full bg-rentify-surface px-3 py-1 text-xs text-rentify-text-secondary">
                  {date.toLocaleDateString(i18n.language.startsWith('en') ? 'en-US' : 'vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
            )}
            <ChatMessageItem
              kind="message"
              message={item.message}
              previousMessage={item.previousMessage}
              currentUserId={props.currentUserId}
              showSenderName={props.showSenderNames}
              highlighted={item.message.id === props.highlightedMessageId}
              animateEntry={props.liveMessageIds.has(item.message.id)}
              onReply={props.onReply}
              onJumpToMessage={props.onJumpToMessage}
              readReceipt={
                item.message.id === lastOwnMessageId && !props.isAnchored
                  ? {
                      isGroup: props.showSenderNames,
                      readers,
                      totalRecipients: activeOthers.length,
                    }
                  : undefined
              }
            />
          </div>
        );
      })}
      {latestMessage && <div className="h-px" onMouseEnter={props.onLatestVisible} />}
      {props.newMessageCount > 0 && !props.isAnchored && (
        <div className="sticky bottom-2 flex justify-center">
          <Button size="sm" onClick={jumpLatest} className="rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
            {t('newMessages')}
          </Button>
        </div>
      )}
      {props.isAnchored && props.onBackToLatest && (
        <div className="sticky bottom-2 flex justify-center">
          <Button size="sm" onClick={props.onBackToLatest} className="rounded-full shadow-lg">
            {t('backToLatest')}
          </Button>
        </div>
      )}
      {props.latestSequence && <span className="sr-only">{props.latestSequence}</span>}
    </div>
  );
};

const MessageSkeleton = () => (
  <div className="space-y-4 py-4">
    {[0, 1, 2, 3, 4].map((row) => (
      <div key={row} className={`flex ${row % 2 ? 'justify-end' : 'justify-start'}`}>
        <div className="w-2/3 max-w-[78%] space-y-2 rounded-2xl bg-rentify-surface px-4 py-3 shadow-sm">
          <Skeleton variant="text" className="h-3 w-1/3" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const HistoryError = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation('chat');
  return (
    <div className="py-8 text-center">
      <p className="mb-2 text-sm">{t('historyError')}</p>
      <Button variant="ghost" size="sm" onClick={onRetry} className="text-rentify-primary">
        {t('tryLoadAgain')}
      </Button>
    </div>
  );
};
