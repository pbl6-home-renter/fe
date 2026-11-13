import { ArrowLeft, PanelRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTranslation } from 'react-i18next';
import { ConversationAvatar } from './conversation-avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Skeleton } from '@/components/feedback/skeleton';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';

interface ChatWindowHeaderProps {
  title: string;
  avatarMediaId?: string | null;
  isLoading: boolean;
  isGroup: boolean;
  memberCount: number;
  connectionStatus: SocketConnectionStatus;
  canSearch: boolean;
  canManage: boolean;
  isManageOpen: boolean;
  onBack: () => void;
  onSearch: () => void;
  onManage: () => void;
}

export const ChatWindowHeader = (props: ChatWindowHeaderProps) => {
  const { t } = useTranslation('chat');
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-rentify-divider bg-rentify-surface px-3 md:px-5">
      <IconButton className="md:hidden" aria-label={t('backToList')} onClick={props.onBack}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      {props.isLoading ? (
        <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
      ) : (
        <ConversationAvatar name={props.title} avatarMediaId={props.avatarMediaId} size="md" />
      )}
      <div className="min-w-0 flex-1">
        {props.isLoading ? (
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40 max-w-full rounded-full" />
            <Skeleton className="h-2.5 w-20 rounded-full" />
          </div>
        ) : (
          <h2 className="truncate text-sm font-semibold" title={props.title}>
            {props.title}
          </h2>
        )}
        {props.isGroup && (
          <p className="text-xs text-rentify-text-secondary">{t('memberCount', { count: props.memberCount })}</p>
        )}
      </div>
      {props.connectionStatus === 'reconnecting' && (
        <span className="hidden text-xs text-rentify-neutral sm:inline">{t('reconnecting')}</span>
      )}
      {props.connectionStatus === 'connecting' && (
        <span className="hidden text-xs text-rentify-neutral sm:inline">{t('connecting')}</span>
      )}
      {props.canSearch && (
        <IconButton
          id="chat-search-trigger"
          type="button"
          variant="ghost"
          aria-label={t('searchMessages')}
          onClick={props.onSearch}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      )}
      {props.canManage && (
        <>
          <IconButton
            type="button"
            variant="ghost"
            className={cn('md:hidden', props.isManageOpen && 'bg-rentify-primary-container text-rentify-primary')}
            aria-label={t('groupManagement.open')}
            aria-pressed={props.isManageOpen}
            onClick={props.onManage}
          >
            <PanelRight className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={props.isManageOpen}
            className={cn(
              'hidden md:inline-flex',
              props.isManageOpen && 'bg-rentify-primary-container text-rentify-primary',
            )}
            onClick={props.onManage}
          >
            <PanelRight className="h-4 w-4" aria-hidden="true" />
            {t('groupManagement.open')}
          </Button>
        </>
      )}
    </header>
  );
};
