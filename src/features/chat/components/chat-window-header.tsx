import { ArrowLeft, Search, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Skeleton } from '@/components/feedback/skeleton';
import type { SocketConnectionStatus } from '@/features/realtime/context/socket-session.context';

interface ChatWindowHeaderProps {
  title: string;
  avatarSrc?: string;
  isLoading: boolean;
  isGroup: boolean;
  memberCount: number;
  connectionStatus: SocketConnectionStatus;
  canSearch: boolean;
  canManage: boolean;
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
        <Skeleton variant="circular" className="h-8 w-8 shrink-0" />
      ) : (
        <Avatar src={props.avatarSrc} name={props.title} size="sm" />
      )}
      <div className="min-w-0 flex-1">
        {props.isLoading ? (
          <Skeleton className="h-4 w-36 max-w-full" />
        ) : (
          <h2 className="truncate text-sm font-semibold">{props.title}</h2>
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
            className="md:hidden"
            aria-label={t('groupManagement.open')}
            onClick={props.onManage}
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={props.onManage}>
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            {t('groupManagement.open')}
          </Button>
        </>
      )}
    </header>
  );
};
