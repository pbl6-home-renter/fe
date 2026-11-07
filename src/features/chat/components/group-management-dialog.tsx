import { useRef } from 'react';
import { Camera, Crown, LogOut, Shield, UserPlus, UserRoundX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ConversationMember } from '../types/chat.dto';
import { useGroupManagement } from '../hooks/use-group-management';

interface GroupManagementDialogProps {
  conversationId: string;
  currentUserId?: string;
  open: boolean;
  onClose: () => void;
  onLeft: () => void;
}

export const GroupManagementDialog = (props: GroupManagementDialogProps) => {
  const { t } = useTranslation('chat');
  const fileRef = useRef<HTMLInputElement>(null);
  const group = useGroupManagement(props);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      closeOnEsc={!group.confirmation}
      title={t('groupManagement.title')}
      maxWidth="xl"
    >
      {group.isLoading ? (
        <p className="py-8 text-center text-sm text-rentify-text-secondary">{t('loadingMessages')}</p>
      ) : group.detail.isError || !group.conversation ? (
        <div role="alert" className="py-6 text-center">
          <p className="mb-3 text-sm text-rentify-error">{t('groupManagement.loadError')}</p>
          <Button variant="outline" size="sm" onClick={group.retry}>
            {t('tryLoadAgain')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <GroupAvatarSection
            name={group.conversation.displayName ?? group.conversation.title ?? ''}
            src={group.avatarSrc}
            avatarMediaId={group.conversation.avatarMediaId}
            isAdmin={group.isAdmin}
            isUploading={group.isUploadingAvatar}
            isBusy={group.isActing}
            fileRef={fileRef}
            onSelectFile={group.onAvatarChange}
            onRemove={group.onRemoveAvatar}
            t={t}
          />

          {group.isAdmin && (
            <section className="flex items-end gap-2">
              <Input
                label={t('groupManagement.name')}
                maxLength={255}
                value={group.title ?? group.conversation.title ?? ''}
                disabled={group.isActing}
                onChange={(event) => group.onTitleChange(event.target.value)}
              />
              <Button
                size="sm"
                disabled={
                  group.title === undefined || group.title === (group.conversation.title ?? '') || group.isActing
                }
                isLoading={group.isSavingTitle}
                onClick={group.onSaveTitle}
              >
                {t('groupManagement.save')}
              </Button>
            </section>
          )}

          <MemberSection
            members={group.activeMembers}
            adminCount={group.adminCount}
            currentUserId={props.currentUserId}
            canManage={group.isAdmin}
            isBusy={group.isActing}
            onRoleChange={group.onRoleChange}
            onRemove={group.onRequestRemove}
            t={t}
          />

          {group.isAdmin && (
            <AddMembersSection
              candidates={group.candidates}
              selectedIds={group.selectedIds}
              search={group.search}
              isLoading={group.isDirectoryLoading}
              isError={group.isDirectoryError}
              hasMore={group.hasMoreCandidates}
              isAdding={group.isActing}
              onSearchChange={group.onSearchChange}
              onToggleUser={group.onToggleUser}
              onLoadMore={group.loadMoreCandidates}
              onRetry={group.retryDirectory}
              onAdd={group.onAddSelected}
              t={t}
            />
          )}

          <div className="flex justify-end border-t border-rentify-divider pt-4">
            <Button variant="danger" size="sm" disabled={group.isActing} onClick={group.onRequestLeave}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t('groupManagement.leave')}
            </Button>
          </div>
        </div>
      )}
      <GroupActionConfirmation group={group} t={t} />
    </Dialog>
  );
};

interface GroupSectionTranslationProps {
  t: ReturnType<typeof useTranslation<'chat'>>['t'];
}

interface GroupAvatarSectionProps extends GroupSectionTranslationProps {
  name: string;
  src?: string;
  avatarMediaId: string | null;
  isAdmin: boolean;
  isUploading: boolean;
  isBusy: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onSelectFile: (file?: File) => void;
  onRemove: () => void;
}

const GroupAvatarSection = ({
  name,
  src,
  avatarMediaId,
  isAdmin,
  isUploading,
  isBusy,
  fileRef,
  onSelectFile,
  onRemove,
  t,
}: GroupAvatarSectionProps) => (
  <section className="flex items-center gap-4">
    <Avatar src={src} name={name} size="lg" />
    {isAdmin && (
      <>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={t('groupManagement.changePhoto')}
          onChange={(event) => {
            onSelectFile(event.target.files?.[0]);
            event.currentTarget.value = '';
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={isBusy}
          isLoading={isUploading}
          onClick={() => fileRef.current?.click()}
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          {t('groupManagement.changePhoto')}
        </Button>
        {avatarMediaId && (
          <Button variant="ghost" size="sm" disabled={isBusy} onClick={onRemove}>
            {t('groupManagement.removePhoto')}
          </Button>
        )}
      </>
    )}
  </section>
);

interface MemberSectionProps extends GroupSectionTranslationProps {
  members: ConversationMember[];
  adminCount: number;
  currentUserId?: string;
  canManage: boolean;
  isBusy: boolean;
  onRoleChange: (userId: string, role: 'admin' | 'member') => void;
  onRemove: (member: ConversationMember) => void;
}

const MemberSection = ({
  members,
  adminCount,
  currentUserId,
  canManage,
  isBusy,
  onRoleChange,
  onRemove,
  t,
}: MemberSectionProps) => (
  <section>
    <h3 className="mb-3 text-sm font-semibold">{t('groupManagement.members', { count: members.length })}</h3>
    <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-rentify-divider p-2">
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          canManage={canManage && member.userId !== currentUserId}
          canDemote={adminCount > 1 || member.role !== 'admin'}
          isBusy={isBusy}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
          t={t}
        />
      ))}
    </div>
  </section>
);

interface AddMembersSectionProps extends GroupSectionTranslationProps {
  candidates: Array<{ id: string; name: string }>;
  selectedIds: string[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  hasMore?: boolean;
  isAdding: boolean;
  onSearchChange: (value: string) => void;
  onToggleUser: (userId: string, checked: boolean) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onAdd: () => void;
}

const AddMembersSection = ({
  candidates,
  selectedIds,
  search,
  isLoading,
  isError,
  hasMore,
  isAdding,
  onSearchChange,
  onToggleUser,
  onLoadMore,
  onRetry,
  onAdd,
  t,
}: AddMembersSectionProps) => (
  <section>
    <h3 className="mb-2 text-sm font-semibold">{t('groupManagement.addMembers')}</h3>
    <Input label={t('searchPeople')} value={search} onChange={(event) => onSearchChange(event.target.value)} />
    <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
      {candidates.map((person) => (
        <Checkbox
          key={person.id}
          label={
            <span className="flex items-center gap-3">
              <Avatar name={person.name} size="sm" />
              <span className="text-sm">{person.name}</span>
            </span>
          }
          checked={selectedIds.includes(person.id)}
          disabled={isAdding}
          onChange={(event) => onToggleUser(person.id, event.target.checked)}
          className="w-full rounded-lg px-2 py-2 hover:bg-rentify-background"
        />
      ))}
      {isLoading && <p className="py-2 text-sm text-rentify-text-secondary">{t('loadingPeople')}</p>}
      {isError && (
        <div role="alert" className="py-2 text-sm text-rentify-error">
          {t('peopleError')}{' '}
          <Button variant="ghost" size="sm" onClick={onRetry}>
            {t('tryLoadAgain')}
          </Button>
        </div>
      )}
      {!isLoading && !isError && candidates.length === 0 && (
        <p className="py-2 text-sm text-rentify-text-secondary">{t('noPeopleFound')}</p>
      )}
      {hasMore && (
        <Button variant="ghost" size="sm" disabled={isLoading} onClick={onLoadMore}>
          {t('loadMorePeople')}
        </Button>
      )}
    </div>
    <Button className="mt-3" size="sm" disabled={!selectedIds.length || isAdding} isLoading={isAdding} onClick={onAdd}>
      <UserPlus className="h-4 w-4" aria-hidden="true" />
      {t('groupManagement.addSelected', { count: selectedIds.length })}
    </Button>
  </section>
);

interface MemberRowProps extends GroupSectionTranslationProps {
  member: ConversationMember;
  canManage: boolean;
  canDemote: boolean;
  isBusy: boolean;
  onRoleChange: (userId: string, role: 'admin' | 'member') => void;
  onRemove: (member: ConversationMember) => void;
}

const MemberRow = ({ member, canManage, canDemote, isBusy, onRoleChange, onRemove, t }: MemberRowProps) => (
  <div className="flex items-center gap-3 rounded-lg px-2 py-2">
    <Avatar name={member.displayName} size="sm" />
    <span className="min-w-0 flex-1 truncate text-sm">{member.displayName}</span>
    {member.role === 'admin' && (
      <span className="inline-flex items-center gap-1 text-xs text-rentify-primary">
        <Crown className="h-3.5 w-3.5" aria-hidden="true" />
        {t('groupManagement.admin')}
      </span>
    )}
    {canManage && (
      <>
        <Button
          variant="ghost"
          size="sm"
          disabled={isBusy || (member.role === 'admin' && !canDemote)}
          aria-label={t(member.role === 'admin' ? 'groupManagement.demote' : 'groupManagement.promote')}
          onClick={() => member.userId && onRoleChange(member.userId, member.role === 'admin' ? 'member' : 'admin')}
        >
          <Shield className="h-4 w-4" aria-hidden="true" />
          {t(member.role === 'admin' ? 'groupManagement.demote' : 'groupManagement.promote')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isBusy}
          aria-label={t('groupManagement.remove')}
          onClick={() => onRemove(member)}
        >
          <UserRoundX className="h-4 w-4" aria-hidden="true" />
        </Button>
      </>
    )}
  </div>
);

interface GroupActionConfirmationProps {
  group: ReturnType<typeof useGroupManagement>;
  t: ReturnType<typeof useTranslation<'chat'>>['t'];
}

const GroupActionConfirmation = ({ group, t }: GroupActionConfirmationProps) => (
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
