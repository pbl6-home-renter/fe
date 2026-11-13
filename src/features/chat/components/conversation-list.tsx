import { Search, X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/feedback/empty-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { CHAT_SEARCH_MAX_LENGTH, CHAT_UNREAD_BADGE_MAX } from '../constants/chat.constants';
import { useConversationList } from '../hooks/use-conversation-list';
import type { ConversationSummary } from '../types/chat.dto';
import { formatChatMessage } from '../utils/format-chat-message';
import { ConversationAvatar } from './conversation-avatar';

interface ConversationListProps {
  search: string;
  selectedId?: string;
  onSearchChange: (value: string) => void;
  onSelect: (conversation: ConversationSummary) => void;
  onNewChat: () => void;
}

export const ConversationList = (props: ConversationListProps) => {
  const { query, scrollRef, conversations } = useConversationList(props.search);

  return (
    <aside className="flex min-h-0 w-full flex-col border-r border-rentify-divider bg-rentify-surface md:w-88 md:shrink-0">
      <ListHeader search={props.search} onSearchChange={props.onSearchChange} onNewChat={props.onNewChat} />
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            selected={props.selectedId === conversation.id}
            disabled={query.isSearchPending || query.isPlaceholderData}
            onSelect={() => props.onSelect(conversation)}
          />
        ))}
        <ListStatus
          isLoading={query.isLoading || query.isSearchPending || query.isPlaceholderData}
          isError={query.isError && !query.isSearchPending}
          isLoadingNext={query.isFetchingNextPage}
          isNextPageError={query.isFetchNextPageError}
          hasConversations={conversations.length > 0}
          hasSearch={Boolean(props.search)}
          onRetry={() => void query.refetch()}
          onRetryNext={() => void query.fetchNextPage()}
          onClearSearch={() => props.onSearchChange('')}
          onNewChat={props.onNewChat}
        />
      </div>
    </aside>
  );
};

interface ListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
}

const ListHeader = ({ search, onSearchChange, onNewChat }: ListHeaderProps) => {
  const { t } = useTranslation('chat');
  return (
    <div className="space-y-4 border-b border-rentify-divider p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('title')}</h1>
        <Button size="sm" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          {t('newChat')}
        </Button>
      </div>
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        maxLength={CHAT_SEARCH_MAX_LENGTH}
        placeholder={t('search')}
        aria-label={t('search')}
        leadingIcon={<Search className="h-4 w-4" />}
        trailingIcon={
          search ? (
            <IconButton size="sm" aria-label={t('clearSearch')} onClick={() => onSearchChange('')}>
              <X className="h-4 w-4" />
            </IconButton>
          ) : undefined
        }
      />
    </div>
  );
};

interface ConversationRowProps {
  conversation: ConversationSummary;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const ConversationRow = ({ conversation, selected, disabled, onSelect }: ConversationRowProps) => {
  const { t, i18n } = useTranslation('chat');
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
  const displayName = conversation.displayName ?? conversation.title ?? '';
  const preview = conversation.lastMessage ? formatChatMessage(conversation.lastMessage, t) : '';
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-current={selected ? 'page' : undefined}
      title={displayName}
      className={cn(
        'ui-press relative flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left outline-none focus-visible:bg-rentify-background focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rentify-primary disabled:cursor-wait disabled:opacity-70',
        selected ? 'bg-rentify-primary-container' : 'hover:bg-rentify-background',
      )}
    >
      {selected && (
        <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-rentify-primary" />
      )}
      <ConversationAvatar
        name={displayName}
        avatarMediaId={conversation.kind === 'group' ? conversation.avatarMediaId : null}
        size="lg"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-baseline gap-2">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-sm',
              hasUnread ? 'font-bold text-rentify-text-primary' : 'font-semibold text-rentify-text-primary',
            )}
          >
            {displayName}
          </span>
          {conversation.lastMessage && (
            <time
              className={cn(
                'shrink-0 text-[11px]',
                hasUnread ? 'font-semibold text-rentify-primary' : 'text-rentify-neutral',
              )}
            >
              {formatConversationTime(conversation.lastMessage.sentAt, locale)}
            </time>
          )}
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-xs',
              hasUnread ? 'font-semibold text-rentify-text-primary' : 'text-rentify-text-secondary',
            )}
          >
            {preview}
          </span>
          {hasUnread && <UnreadBadge count={conversation.unreadCount} />}
        </span>
      </span>
    </button>
  );
};

const UnreadBadge = ({ count }: { count: number }) => (
  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rentify-primary px-1.5 text-[10px] font-bold text-white">
    {count > CHAT_UNREAD_BADGE_MAX ? `${CHAT_UNREAD_BADGE_MAX}+` : count}
  </span>
);

const formatConversationTime = (value: string, locale: string) => {
  const date = new Date(value);
  return date.toDateString() === new Date().toDateString()
    ? date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
};

interface ListStatusProps {
  isLoading: boolean;
  isError: boolean;
  isLoadingNext: boolean;
  isNextPageError: boolean;
  hasConversations: boolean;
  hasSearch: boolean;
  onRetry: () => void;
  onRetryNext: () => void;
  onClearSearch: () => void;
  onNewChat: () => void;
}

const ListStatus = (props: ListStatusProps) => {
  const { t } = useTranslation('chat');
  if (props.isLoading && props.hasConversations)
    return (
      <div
        role="status"
        aria-label={t('loadingConversations')}
        className="pointer-events-none absolute right-2 top-2 z-10 rounded-full bg-rentify-surface px-3 py-1 text-xs text-rentify-text-secondary shadow-sm"
      >
        {t('loadingConversations')}
      </div>
    );
  if (props.isLoading) return <ConversationSkeleton />;
  if (props.isNextPageError) {
    return <StatusMessage message={t('loadMoreError')} action={t('tryLoadAgain')} onAction={props.onRetryNext} />;
  }
  if (props.isError) {
    return <StatusMessage message={t('loadError')} action={t('tryLoadAgain')} onAction={props.onRetry} />;
  }
  if (props.isLoadingNext) return <ConversationSkeleton count={2} />;
  if (!props.hasConversations) {
    return (
      <EmptyState
        title={props.hasSearch ? t('emptySearch') : t('emptyList')}
        actionText={props.hasSearch ? t('clearSearch') : t('newChat')}
        onAction={props.hasSearch ? props.onClearSearch : props.onNewChat}
        className="px-5 py-10"
      />
    );
  }
  return null;
};

const StatusMessage = ({ message, action, onAction }: { message: string; action: string; onAction: () => void }) => (
  <div role="alert" className="p-4 text-center">
    <p className="mb-2 text-sm text-rentify-error">{message}</p>
    <Button variant="ghost" size="sm" onClick={onAction}>
      {action}
    </Button>
  </div>
);

const SKELETON_NAME_WIDTHS = ['w-3/5', 'w-2/5', 'w-1/2', 'w-2/3', 'w-1/3'];
const SKELETON_PREVIEW_WIDTHS = ['w-4/5', 'w-3/5', 'w-2/3', 'w-1/2', 'w-3/4'];

const ConversationSkeleton = ({ count = 6 }: { count?: number }) => {
  const { t } = useTranslation('chat');
  return (
    <div role="status" aria-label={t('loadingConversations')} aria-busy="true">
      {Array.from({ length: count }, (_, row) => (
        <div key={row} className="flex items-center gap-3 px-4 py-3" aria-hidden="true">
          <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className={`h-3.5 rounded-full ${SKELETON_NAME_WIDTHS[row % SKELETON_NAME_WIDTHS.length]}`} />
              <Skeleton className="ml-auto h-2.5 w-8 rounded-full" />
            </div>
            <Skeleton className={`h-3 rounded-full ${SKELETON_PREVIEW_WIDTHS[row % SKELETON_PREVIEW_WIDTHS.length]}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
