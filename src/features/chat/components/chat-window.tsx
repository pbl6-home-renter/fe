import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { useChatWindow } from '../hooks/use-chat-window';
import { ChatMessageFeed } from './chat-message-feed';
import { ChatComposer } from './chat-composer';
import type { PendingMessage } from '../hooks/use-chat-composer';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';
import { GroupManagementDialog } from './group-management-dialog';

interface ChatWindowProps {
  conversationId?: string;
  draftRecipient?: { id: string; name: string };
  connectionStatus: SocketConnectionStatus;
  draft: string;
  pending: PendingMessage[];
  imageDraft?: File;
  isSending: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSelectImage: (file?: File) => void;
  onRemoveImage: () => void;
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
  isSending,
  onDraftChange,
  onSend,
  onSelectImage,
  onRemoveImage,
  onRetry,
  onBack,
}: ChatWindowProps) => {
  const { t } = useTranslation('chat');
  const window = useChatWindow({ conversationId, draftName: draftRecipient?.name, connectionStatus });
  const [manageOpen, setManageOpen] = useState(false);

  if (!conversationId && !draftRecipient)
    return (
      <section className="hidden min-w-0 flex-1 items-center justify-center text-rentify-text-secondary md:flex">
        {t('chooseConversation')}
      </section>
    );
  if (conversationId && window.detail.isError && !window.detail.data)
    return (
      <section className="flex min-w-0 flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p>{t('conversationMissing')}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={window.retryLoad}>
              {t('tryLoadAgain')}
            </Button>
            <Button variant="outline" size="sm" onClick={onBack}>
              {t('backToList')}
            </Button>
          </div>
        </div>
      </section>
    );

  const activeMembers =
    window.detail.data?.members.filter((member) => member.participantType === 'user' && member.status === 'active')
      .length ?? 0;
  const isReadOnly = Boolean(conversationId && (!window.currentMember || window.currentMember.status !== 'active'));

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-rentify-background">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-rentify-divider bg-rentify-surface px-5">
        <IconButton className="md:hidden" aria-label={t('backToList')} onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <Avatar src={window.avatarSrc} name={window.title} size="sm" />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{window.title}</h2>
          {window.detail.data?.kind === 'group' && (
            <p className="text-xs text-rentify-text-secondary">{t('memberCount', { count: activeMembers })}</p>
          )}
        </div>
        {connectionStatus === 'reconnecting' && (
          <span className="ml-auto text-xs text-rentify-neutral">{t('reconnecting')}</span>
        )}
        {connectionStatus === 'connecting' && (
          <span className="ml-auto text-xs text-rentify-neutral">{t('connecting')}</span>
        )}
        {conversationId && window.detail.data?.kind === 'group' && window.currentMember?.status === 'active' && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setManageOpen(true)}>
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            {t('groupManagement.open')}
          </Button>
        )}
      </header>
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
        showSenderNames={window.detail.data?.kind === 'group'}
      />
      {!window.detail.isLoading && (
        <ChatComposer
          value={draft}
          readOnly={isReadOnly}
          isSending={isSending}
          imageFile={imageDraft}
          onChange={onDraftChange}
          onSend={onSend}
          onSelectImage={onSelectImage}
          onRemoveImage={onRemoveImage}
        />
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
