import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { MessagesSquare } from 'lucide-react';
import { useChatWindow } from '../hooks/use-chat-window';
import { ChatMessageFeed } from './chat-message-feed';
import { ChatComposer } from './chat-composer';
import type { PendingMessage } from '../hooks/use-chat-composer';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';
import { GroupInfoPanel } from './group-info-panel';
import { ChatMessageSearchOverlay } from './chat-message-search-overlay';
import { useChatEnhancements } from '../hooks/use-chat-enhancements';
import type { ChatReplyReference } from '../types/chat.dto';
import { Skeleton } from '@/components/feedback/skeleton';
import { useNotify } from '@/lib/notifications/use-notify';
import { ChatWindowHeader } from './chat-window-header';
import { ChatWindowError } from './chat-window-error';
import { ChatTypingIndicator } from './chat-typing-indicator';

interface ChatWindowProps {
  conversationId?: string;
  draftRecipient?: { id: string; name: string };
  connectionStatus: SocketConnectionStatus;
  draft: string;
  pending: PendingMessage[];
  imageDraft?: File;
  replyTo?: ChatReplyReference;
  isSending: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSelectImage: (file?: File) => void;
  onRemoveImage: () => void;
  onReply: (reply?: ChatReplyReference) => void;
  onCancelReply: () => void;
  onRetry: (item: PendingMessage) => void;
  onBack: () => void;
}

export const ChatWindow = ({
  conversationId,
  draftRecipient,
  connectionStatus,
  draft,
  pending,
  imageDraft,
  replyTo,
  isSending,
  onDraftChange,
  onSend,
  onSelectImage,
  onRemoveImage,
  onReply,
  onCancelReply,
  onRetry,
  onBack,
}: ChatWindowProps) => {
  const { t } = useTranslation('chat');
  const notify = useNotify();
  const [manageOpen, setManageOpen] = useState(false);
  const enhancements = useChatEnhancements(conversationId);
  const window = useChatWindow({
    conversationId,
    draftName: draftRecipient?.name,
    connectionStatus,
    maxSequence: enhancements.anchorSequence,
    isContentCovered: enhancements.searchOpen,
  });

  if (!conversationId && !draftRecipient)
    return (
      <section className="hidden min-w-0 flex-1 flex-col items-center justify-center gap-3 bg-rentify-background text-rentify-text-secondary md:flex">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rentify-primary-container text-rentify-primary">
          <MessagesSquare className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-sm">{t('chooseConversation')}</p>
      </section>
    );
  if (conversationId && window.detail.isError && !window.detail.data)
    return <ChatWindowError onRetry={window.retryLoad} onBack={onBack} />;

  const isGroup = window.detail.data?.kind === 'group';
  const activeMembers =
    window.detail.data?.members.filter((member) => member.participantType === 'user' && member.status === 'active')
      .length ?? 0;
  const isReadOnly = Boolean(conversationId && (!window.currentMember || window.currentMember.status !== 'active'));
  const canManage = Boolean(conversationId && isGroup && window.currentMember?.status === 'active');
  const typingNames = enhancements.typingUserIds
    .map(
      (id) =>
        window.detail.data?.members.find((member) => member.userId === id && member.status === 'active')?.displayName,
    )
    .filter((name): name is string => Boolean(name));
  const searchResults = enhancements.search.data?.pages.flatMap((page) => page.items) ?? [];
  const isLoaded = (id: string) => window.messages.some((message) => message.id === id);

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-rentify-background">
        <ChatWindowHeader
          title={window.title}
          avatarSrc={window.avatarSrc}
          isLoading={window.detail.isLoading && !draftRecipient}
          isGroup={isGroup}
          memberCount={activeMembers}
          connectionStatus={connectionStatus}
          canSearch={Boolean(conversationId)}
          canManage={canManage}
          isManageOpen={manageOpen}
          onBack={onBack}
          onSearch={() => enhancements.setSearchOpen(true)}
          onManage={() => setManageOpen((open) => !open)}
        />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <ChatMessageFeed
            messages={window.messages}
            isLoading={window.history.isLoading}
            isError={window.history.isError && !window.history.data}
            isOlderError={window.history.isFetchNextPageError}
            onRetry={() =>
              void (window.history.isFetchNextPageError ? window.history.fetchNextPage() : window.history.refetch())
            }
            onLoadOlder={() => void window.history.fetchNextPage()}
            hasOlder={window.history.hasNextPage}
            isLoadingOlder={window.history.isFetchingNextPage}
            latestSequence={window.lastSequence}
            onLatestVisible={window.markLatestRead}
            newMessageCount={window.newCount}
            pending={pending}
            onRetryPending={onRetry}
            onAtBottomChange={window.setAtBottom}
            currentUserId={window.currentUserId}
            liveMessageIds={window.liveMessageIds}
            isGroup={isGroup}
            members={window.detail.data?.members}
            highlightedMessageId={enhancements.highlightedMessageId}
            isAnchored={Boolean(enhancements.anchorSequence)}
            hasNewer={window.hasNewer}
            isLoadingNewer={window.isLoadingNewer}
            onLoadNewer={window.loadNewer}
            onBackToLatest={(glide) => enhancements.backToLatest(glide)}
            onReply={isReadOnly ? undefined : onReply}
            onJumpToMessage={(id, sequence) => {
              const loaded = isLoaded(id);
              const targetSequence = sequence ?? window.messages.find((message) => message.id === id)?.sequence;
              if (loaded || targetSequence) enhancements.jumpToMessage(id, targetSequence, loaded);
              else notify.info(t('replyLocationUnavailable'));
            }}
          />
          {!enhancements.searchOpen && <ChatTypingIndicator names={typingNames} />}
          <ChatMessageSearchOverlay
            open={enhancements.searchOpen}
            value={enhancements.searchInput}
            debouncedValue={enhancements.debouncedSearch}
            results={searchResults}
            isLoading={enhancements.search.isLoading}
            isError={enhancements.search.isError}
            isLoadingMore={enhancements.search.isFetchingNextPage}
            hasMore={Boolean(enhancements.search.hasNextPage)}
            onChange={enhancements.setSearchInput}
            onClose={() => {
              enhancements.setSearchOpen(false);
              document.getElementById('chat-search-trigger')?.focus();
            }}
            onRetry={() => void enhancements.search.refetch()}
            onLoadMore={() => void enhancements.search.fetchNextPage()}
            onSelect={(result) => enhancements.selectSearchResult(result, isLoaded(result.id))}
          />
        </div>
        {!window.detail.isLoading && (
          <ChatComposer
            value={draft}
            readOnly={isReadOnly}
            isSending={isSending}
            imageFile={imageDraft}
            replyTo={replyTo}
            onChange={(value) => {
              onDraftChange(value);
              if (!isReadOnly) enhancements.sendTyping(value);
            }}
            onSend={() => {
              enhancements.stopTyping();
              if (enhancements.anchorSequence) enhancements.backToLatest();
              onSend();
            }}
            onSelectImage={onSelectImage}
            onRemoveImage={onRemoveImage}
            onCancelReply={onCancelReply}
            onBlur={enhancements.stopTyping}
          />
        )}
        {window.detail.isLoading && <ComposerSkeleton />}
      </div>
      {manageOpen && canManage && conversationId && (
        <GroupInfoPanel
          conversationId={conversationId}
          currentUserId={window.currentUserId}
          onClose={() => setManageOpen(false)}
          onLeft={onBack}
          onSearchMessages={() => enhancements.setSearchOpen(true)}
        />
      )}
    </section>
  );
};

const ComposerSkeleton = () => (
  <div
    className="flex shrink-0 items-center gap-2 border-t border-rentify-divider bg-rentify-surface p-3"
    aria-hidden="true"
  >
    <Skeleton variant="circular" className="h-10 w-10" />
    <Skeleton className="h-11 flex-1 rounded-full" />
    <Skeleton variant="circular" className="h-10 w-10" />
  </div>
);
