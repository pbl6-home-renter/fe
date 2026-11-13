import { useRef, useState, type KeyboardEvent } from 'react';
import {
  Camera,
  Check,
  Crown,
  LogOut,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  ShieldOff,
  UserPlus,
  UserRoundX,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { ConversationAvatar } from './conversation-avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/feedback/skeleton';
import { cn } from '@/lib/utils/cn';
import { CHAT_GROUP_TITLE_MAX_LENGTH } from '../constants/chat.constants';
import type { ConversationMember } from '../types/chat.dto';
import { useGroupManagement } from '../hooks/use-group-management';

interface GroupInfoPanelProps {
  conversationId: string;
  currentUserId?: string;
  onClose: () => void;
  onLeft: () => void;
  onSearchMessages: () => void;
}

type GroupState = ReturnType<typeof useGroupManagement>;

/** Side panel with the group profile, members and actions (replaces the old modal). */
export const GroupInfoPanel = (props: GroupInfoPanelProps) => {
  const { t } = useTranslation('chat');
  const group = useGroupManagement({ ...props, open: true });
  const [addOpen, setAddOpen] = useState(false);

  return (
    <aside
      aria-label={t('groupInfo.title')}
      className="chat-panel-in absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-rentify-divider bg-rentify-surface shadow-2xl xl:static xl:z-auto xl:w-80 xl:max-w-none xl:shrink-0 xl:shadow-none 2xl:w-96"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-rentify-divider px-4">
        <h2 className="text-sm font-semibold">{t('groupInfo.title')}</h2>
        <IconButton aria-label={t('groupInfo.close')} title={t('groupInfo.close')} onClick={props.onClose}>
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {group.isLoading ? (
          <PanelSkeleton />
        ) : group.detail.isError || !group.conversation ? (
          <div role="alert" className="px-4 py-10 text-center">
            <p className="mb-3 text-sm text-rentify-error">{t('groupManagement.loadError')}</p>
            <Button variant="outline" size="sm" onClick={group.retry}>
              {t('tryLoadAgain')}
            </Button>
          </div>
        ) : (
          <>
            <GroupProfile group={group} />
            <QuickActions
              canAdd={group.isAdmin}
              addOpen={addOpen}
              onSearch={props.onSearchMessages}
              onToggleAdd={() => setAddOpen((open) => !open)}
            />
            {group.isAdmin && addOpen && <AddMembers group={group} onDone={() => setAddOpen(false)} />}
            <MemberList group={group} currentUserId={props.currentUserId} />
          </>
        )}
      </div>
      {!group.isLoading && group.conversation && (
        <footer className="shrink-0 border-t border-rentify-divider p-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={group.isActing}
            onClick={group.onRequestLeave}
            className="w-full justify-start text-rentify-error hover:bg-rentify-error/10 hover:text-rentify-error"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t('groupManagement.leave')}
          </Button>
        </footer>
      )}
      <GroupActionConfirmation group={group} />
    </aside>
  );
};

const GroupProfile = ({ group }: { group: GroupState }) => {
  const { t } = useTranslation('chat');
  const fileRef = useRef<HTMLInputElement>(null);
  const conversation = group.conversation!;
  const name = conversation.displayName ?? conversation.title ?? '';

  return (
    <section className="flex flex-col items-center gap-3 border-b border-rentify-divider px-5 pb-5 pt-6 text-center">
      <div className="relative">
        <ConversationAvatar name={name} avatarMediaId={conversation.avatarMediaId} size="xl" className="h-20 w-20" />
        {group.isAdmin && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(event) => {
                group.onAvatarChange(event.target.files?.[0]);
                event.currentTarget.value = '';
              }}
            />
            <IconButton
              size="sm"
              variant="outline"
              aria-label={t('groupManagement.changePhoto')}
              title={t('groupManagement.changePhoto')}
              disabled={group.isActing}
              isLoading={group.isUploadingAvatar}
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-rentify-surface shadow-md"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </>
        )}
      </div>
      <GroupName group={group} name={name} />
      <p className="text-xs text-rentify-text-secondary">{t('memberCount', { count: group.activeMembers.length })}</p>
      {group.isAdmin && conversation.avatarMediaId && (
        <Button variant="ghost" size="sm" disabled={group.isActing} onClick={group.onRemoveAvatar} className="text-xs">
          {t('groupManagement.removePhoto')}
        </Button>
      )}
    </section>
  );
};

/** Admins rename the group in place: Enter saves, Escape cancels. */
const GroupName = ({ group, name }: { group: GroupState; name: string }) => {
  const { t } = useTranslation('chat');
  const editing = group.title !== undefined;
  const currentTitle = group.conversation?.title ?? '';

  if (!editing) {
    return (
      <div className="flex max-w-full items-center gap-1">
        <h3 className="min-w-0 truncate text-base font-semibold" title={name}>
          {name}
        </h3>
        {group.isAdmin && (
          <IconButton
            size="sm"
            aria-label={t('groupInfo.rename')}
            title={t('groupInfo.rename')}
            disabled={group.isActing}
            onClick={() => group.onTitleChange(currentTitle || name)}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        )}
      </div>
    );
  }

  const unchanged = group.title === currentTitle;
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !unchanged) group.onSaveTitle();
    if (event.key === 'Escape') {
      event.stopPropagation();
      group.onTitleChange(undefined);
    }
  };

  return (
    <div className="w-full space-y-1.5 text-left">
      <div className="flex items-center gap-1.5">
        <Input
          autoFocus
          aria-label={t('groupManagement.name')}
          maxLength={CHAT_GROUP_TITLE_MAX_LENGTH}
          value={group.title}
          placeholder={t('groupInfo.renamePlaceholder')}
          disabled={group.isSavingTitle}
          onChange={(event) => group.onTitleChange(event.target.value)}
          onKeyDown={onKeyDown}
          containerClassName="min-w-0 flex-1"
        />
        <IconButton
          variant="primary"
          size="sm"
          aria-label={t('groupManagement.save')}
          title={t('groupManagement.save')}
          disabled={unchanged}
          isLoading={group.isSavingTitle}
          onClick={group.onSaveTitle}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
        </IconButton>
        <IconButton
          size="sm"
          aria-label={t('cancel')}
          title={t('cancel')}
          disabled={group.isSavingTitle}
          onClick={() => group.onTitleChange(undefined)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>
      <p className="text-[11px] text-rentify-text-secondary">{t('groupInfo.renameHint')}</p>
    </div>
  );
};

interface QuickActionsProps {
  canAdd: boolean;
  addOpen: boolean;
  onSearch: () => void;
  onToggleAdd: () => void;
}

const QuickActions = ({ canAdd, addOpen, onSearch, onToggleAdd }: QuickActionsProps) => {
  const { t } = useTranslation('chat');
  return (
    <div className="flex justify-center gap-6 border-b border-rentify-divider px-4 py-4">
      <QuickAction
        icon={<Search className="h-4 w-4" aria-hidden="true" />}
        label={t('groupInfo.search')}
        onClick={onSearch}
      />
      {canAdd && (
        <QuickAction
          icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
          label={t('groupManagement.addMembers')}
          active={addOpen}
          onClick={onToggleAdd}
        />
      )}
    </div>
  );
};

const QuickAction = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className="ui-press group flex w-20 flex-col items-center gap-1.5 rounded-xl text-xs text-rentify-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
  >
    <span
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-rentify-primary text-white'
          : 'bg-rentify-surface-container-low text-rentify-text-primary group-hover:bg-rentify-primary-container',
      )}
    >
      {icon}
    </span>
    {label}
  </button>
);

const AddMembers = ({ group, onDone }: { group: GroupState; onDone: () => void }) => {
  const { t } = useTranslation('chat');
  return (
    <section className="chat-message-in space-y-3 border-b border-rentify-divider px-4 py-4">
      <Input
        autoFocus
        aria-label={t('searchPeople')}
        placeholder={t('searchPeople')}
        value={group.search}
        leadingIcon={<Search className="h-4 w-4" />}
        onChange={(event) => group.onSearchChange(event.target.value)}
      />
      <div className="max-h-56 space-y-0.5 overflow-y-auto">
        {group.candidates.map((person) => (
          <Checkbox
            key={person.id}
            label={
              <span className="flex min-w-0 items-center gap-3">
                <UserAvatar name={person.name} size="sm" />
                <span className="truncate text-sm">{person.name}</span>
              </span>
            }
            checked={group.selectedIds.includes(person.id)}
            disabled={group.isActing}
            onChange={(event) => group.onToggleUser(person.id, event.target.checked)}
            className="w-full rounded-lg px-2 py-1.5 hover:bg-rentify-background"
          />
        ))}
        {group.isDirectoryLoading && group.candidates.length === 0 && (
          <div className="space-y-2 py-1" role="status" aria-label={t('loadingPeople')}>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-3 px-2" aria-hidden="true">
                <Skeleton variant="circular" className="h-8 w-8" />
                <Skeleton className="h-3 w-32 rounded-full" />
              </div>
            ))}
          </div>
        )}
        {group.isDirectoryError && (
          <div role="alert" className="py-2 text-sm text-rentify-error">
            {t('peopleError')}{' '}
            <Button variant="ghost" size="sm" onClick={group.retryDirectory}>
              {t('tryLoadAgain')}
            </Button>
          </div>
        )}
        {!group.isDirectoryLoading && !group.isDirectoryError && group.candidates.length === 0 && (
          <p className="px-2 py-2 text-sm text-rentify-text-secondary">{t('noPeopleFound')}</p>
        )}
        {group.hasMoreCandidates && (
          <Button variant="ghost" size="sm" isLoading={group.isDirectoryLoading} onClick={group.loadMoreCandidates}>
            {t('loadMorePeople')}
          </Button>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>
          {t('cancel')}
        </Button>
        <Button
          size="sm"
          disabled={!group.selectedIds.length || group.isActing}
          isLoading={group.isActing && group.selectedIds.length > 0}
          onClick={group.onAddSelected}
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {t('groupManagement.addSelected', { count: group.selectedIds.length })}
        </Button>
      </div>
    </section>
  );
};

const MemberList = ({ group, currentUserId }: { group: GroupState; currentUserId?: string }) => {
  const { t } = useTranslation('chat');
  const members = [...group.activeMembers].sort(
    (left, right) => Number(right.role === 'admin') - Number(left.role === 'admin'),
  );
  return (
    <section className="px-2 py-3">
      <h3 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-rentify-text-secondary">
        {t('groupManagement.members', { count: members.length })}
      </h3>
      <ul>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            isSelf={member.userId === currentUserId}
            canManage={group.isAdmin && member.userId !== currentUserId}
            canDemote={group.adminCount > 1 || member.role !== 'admin'}
            isBusy={group.isActing}
            onRoleChange={group.onRoleChange}
            onRemove={group.onRequestRemove}
          />
        ))}
      </ul>
    </section>
  );
};

interface MemberRowProps {
  member: ConversationMember;
  isSelf: boolean;
  canManage: boolean;
  canDemote: boolean;
  isBusy: boolean;
  onRoleChange: (userId: string, role: 'admin' | 'member') => void;
  onRemove: (member: ConversationMember) => void;
}

const MemberRow = ({ member, isSelf, canManage, canDemote, isBusy, onRoleChange, onRemove }: MemberRowProps) => {
  const { t } = useTranslation('chat');
  const isAdmin = member.role === 'admin';
  return (
    <li className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-rentify-background">
      <UserAvatar name={member.displayName} size="md" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {member.displayName}
          {isSelf && <span className="font-normal text-rentify-text-secondary"> · {t('groupInfo.you')}</span>}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 text-xs',
            isAdmin ? 'text-rentify-primary' : 'text-rentify-text-secondary',
          )}
        >
          {isAdmin && <Crown className="h-3 w-3" aria-hidden="true" />}
          {isAdmin ? t('groupManagement.admin') : t('groupInfo.member')}
        </span>
      </span>
      {canManage && member.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              size="sm"
              disabled={isBusy}
              aria-label={t('groupInfo.memberActions', { name: member.displayName })}
              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={isAdmin && !canDemote}
              onSelect={() => onRoleChange(member.userId!, isAdmin ? 'member' : 'admin')}
              className="gap-2"
            >
              {isAdmin ? (
                <ShieldOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Shield className="h-4 w-4" aria-hidden="true" />
              )}
              {t(isAdmin ? 'groupManagement.demote' : 'groupManagement.promote')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onRemove(member)}
              className="gap-2 text-rentify-error focus:bg-rentify-error/10"
            >
              <UserRoundX className="h-4 w-4" aria-hidden="true" />
              {t('groupManagement.remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </li>
  );
};

const PanelSkeleton = () => {
  const { t } = useTranslation('chat');
  return (
    <div role="status" aria-label={t('loadingMessages')} className="space-y-6 px-5 py-6">
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <Skeleton variant="circular" className="h-20 w-20" />
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
      <div className="space-y-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3 rounded-full" />
              <Skeleton className="h-2.5 w-1/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupActionConfirmation = ({ group }: { group: GroupState }) => {
  const { t } = useTranslation('chat');
  return (
    <Dialog
      open={Boolean(group.confirmation)}
      onClose={group.onCancelConfirmation}
      title={t('groupManagement.confirmTitle')}
      description={
        group.confirmation?.type === 'remove'
          ? t('groupManagement.removeConfirm', { name: group.confirmation.member.displayName })
          : t('groupManagement.leaveConfirm')
      }
      footer={
        <>
          <Button variant="outline" size="sm" disabled={group.isActing} onClick={group.onCancelConfirmation}>
            {t('cancel')}
          </Button>
          <Button variant="danger" size="sm" isLoading={group.isActing} onClick={group.onConfirm}>
            {t('groupManagement.confirm')}
          </Button>
        </>
      }
    />
  );
};
