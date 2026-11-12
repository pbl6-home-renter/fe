import { Search, X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/feedback/empty-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { CHAT_SEARCH_MAX_LENGTH, CHAT_UNREAD_BADGE_MAX } from '../constants/chat.constants';
import { useConversationList } from '../hooks/use-conversation-list';
import type { ConversationSummary } from '../types/chat.dto';
import { formatChatMessage } from '../utils/format-chat-message';

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
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
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

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      disabled={disabled}
      aria-current={selected ? 'page' : undefined}
      className={`h-auto min-h-0 w-full justify-start gap-3 rounded-none border-b border-rentify-divider/70 px-4 py-3 text-left hover:bg-rentify-background ${selected ? 'border-l-4 border-l-rentify-primary bg-rentify-primary-container' : ''}`}
    >
      <Avatar name={displayName} size="md" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold">{displayName}</span>
          {conversation.lastMessage && (
            <time className="shrink-0 text-[11px] text-rentify-neutral">
              {formatConversationTime(conversation.lastMessage.sentAt, locale)}
            </time>
          )}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-rentify-text-secondary">{preview}</span>
          {conversation.unreadCount > 0 && <UnreadBadge count={conversation.unreadCount} />}
        </span>
      </span>
    </Button>
  );
};

const UnreadBadge = ({ count }: { count: number }) => (
  <span className="rounded-full bg-rentify-primary px-2 py-0.5 text-[10px] font-bold text-white">
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

const ConversationSkeleton = ({ count = 5 }: { count?: number }) => {
  const { t } = useTranslation('chat');
  return (
    <div className="space-y-1 p-3" role="status" aria-label={t('loadingConversations')}>
      {Array.from({ length: count }, (_, row) => (
        <div key={row} className="flex items-center gap-3 border-b border-rentify-divider/70 px-1 py-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
