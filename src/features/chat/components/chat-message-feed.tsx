import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import type { ChatMessage } from '../types/chat.dto';
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
  showSenderNames: boolean;
}

export const ChatMessageFeed = (props: ChatMessageFeedProps) => {
  const { t } = useTranslation('chat');
  const { feedRef, handleScroll, loadOlder, jumpLatest } = useChatMessageFeed({
    messageCount: props.messages.length,
    pendingCount: props.pending.length,
    isError: props.isError,
    isLoadingOlder: props.isLoadingOlder,
    hasOlder: props.hasOlder,
    onLoadOlder: props.onLoadOlder,
    onLatestVisible: props.onLatestVisible,
    onAtBottomChange: props.onAtBottomChange,
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
      {feedItems.map((item) =>
        item.kind === 'message' ? (
          <ChatMessageItem
            key={item.key}
            kind="message"
            message={item.message}
            previousMessage={item.previousMessage}
            currentUserId={props.currentUserId}
            showSenderName={props.showSenderNames}
          />
        ) : (
          <ChatMessageItem key={item.key} kind="pending" pending={item.message} onRetry={props.onRetryPending} />
        ),
      )}
      {latestMessage && <div className="h-px" onMouseEnter={props.onLatestVisible} />}
      {props.newMessageCount > 0 && (
        <div className="sticky bottom-2 flex justify-center">
          <Button size="sm" onClick={jumpLatest} className="rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
            {t('newMessages')}
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
