import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useChatWindow } from '../hooks/use-chat-window';
import { ChatMessageFeed } from './chat-message-feed';
import { ChatComposer } from './chat-composer';
import type { PendingMessage } from '../hooks/use-chat-composer';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';
import { GroupManagementDialog } from './group-management-dialog';
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
    isContentCovered: enhancements.searchOpen || manageOpen,
  });

  if (!conversationId && !draftRecipient)
    return (
      <section className="hidden min-w-0 flex-1 items-center justify-center text-rentify-text-secondary md:flex">
        {t('chooseConversation')}
      </section>
    );
  if (conversationId && window.detail.isError && !window.detail.data)
    return <ChatWindowError onRetry={window.retryLoad} onBack={onBack} />;

  const activeMembers =
    window.detail.data?.members.filter((member) => member.participantType === 'user' && member.status === 'active')
      .length ?? 0;
  const isReadOnly = Boolean(conversationId && (!window.currentMember || window.currentMember.status !== 'active'));
  const typingNames = enhancements.typingUserIds
    .map(
      (id) =>
        window.detail.data?.members.find((member) => member.userId === id && member.status === 'active')?.displayName,
    )
    .filter((name): name is string => Boolean(name));
  const searchResults = enhancements.search.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-rentify-background">
      <ChatWindowHeader
        title={window.title}
        avatarSrc={window.avatarSrc}
        isLoading={window.detail.isLoading && !draftRecipient}
        isGroup={window.detail.data?.kind === 'group'}
        memberCount={activeMembers}
        connectionStatus={connectionStatus}
        canSearch={Boolean(conversationId)}
        canManage={Boolean(
          conversationId && window.detail.data?.kind === 'group' && window.currentMember?.status === 'active',
        )}
        onBack={onBack}
        onSearch={() => enhancements.setSearchOpen(true)}
        onManage={() => setManageOpen(true)}
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
          showSenderNames={window.detail.data?.kind === 'group'}
          members={window.detail.data?.members}
          highlightedMessageId={enhancements.highlightedMessageId}
          isAnchored={Boolean(enhancements.anchorSequence)}
          onBackToLatest={enhancements.backToLatest}
          onReply={isReadOnly ? undefined : onReply}
          onJumpToMessage={(id, sequence) => {
            const targetSequence = sequence ?? window.messages.find((message) => message.id === id)?.sequence;
            if (targetSequence) enhancements.jumpToMessage(id, targetSequence);
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
          onSelect={enhancements.selectSearchResult}
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
      {window.detail.isLoading && (
        <div className="h-28 border-t border-rentify-divider bg-rentify-surface p-4">
          <Skeleton className="h-full rounded-xl" />
        </div>
      )}
      {manageOpen && conversationId && window.detail.data?.kind === 'group' && (
        <GroupManagementDialog
          conversationId={conversationId}
          currentUserId={window.currentUserId}
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          onLeft={onBack}
        />
      )}
    </section>
  );
};
