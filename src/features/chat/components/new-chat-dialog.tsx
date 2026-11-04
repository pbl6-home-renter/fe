import { MessageSquare, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  CHAT_GROUP_MINIMUM_OTHER_MEMBERS,
  CHAT_GROUP_TITLE_MAX_LENGTH,
  CHAT_SEARCH_MAX_LENGTH,
} from '../constants/chat.constants';
import { useNewChatDialog } from '../hooks/use-new-chat-dialog';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectDirect: (userId: string, name: string) => void;
  onGroupCreated: (conversationId: string) => void;
}

export const NewChatDialog = (props: NewChatDialogProps) => {
  const { t } = useTranslation('chat');
  const dialog = useNewChatDialog(props);

  return (
    <Dialog open={props.open} onClose={dialog.close} title={t('newConversation')} maxWidth="lg">
      {dialog.mode === 'choose' ? (
        <ChatTypePicker onChoose={dialog.setMode} />
      ) : (
        <div className="space-y-4">
          <Input
            value={dialog.search}
            onChange={(event) => dialog.setSearch(event.target.value)}
            maxLength={CHAT_SEARCH_MAX_LENGTH}
            placeholder={t('searchPeople')}
            aria-label={t('searchPeople')}
          />
          {dialog.mode === 'group' && <GroupTitleInput value={dialog.title} onChange={dialog.setTitle} />}
          {dialog.mode === 'group' && <p className="text-xs text-rentify-text-secondary">{t('groupMinimum')}</p>}
          <UserDirectoryList dialog={dialog} />
          {dialog.mode === 'group' && (
            <GroupActions
              canCreate={dialog.selected.length >= CHAT_GROUP_MINIMUM_OTHER_MEMBERS}
              isCreating={dialog.isCreating}
              onCancel={dialog.close}
              onCreate={() => void dialog.createSelectedGroup()}
            />
          )}
        </div>
      )}
    </Dialog>
  );
};

const ChatTypePicker = ({ onChoose }: { onChoose: (mode: 'direct' | 'group') => void }) => {
  const { t } = useTranslation('chat');
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button variant="outline" onClick={() => onChoose('direct')}>
        <MessageSquare />
        {t('direct')}
      </Button>
      <Button variant="outline" onClick={() => onChoose('group')}>
        <Users />
        {t('group')}
      </Button>
    </div>
  );
};

const GroupTitleInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { t } = useTranslation('chat');
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      maxLength={CHAT_GROUP_TITLE_MAX_LENGTH}
      placeholder={t('groupName')}
      aria-label={t('groupName')}
    />
  );
};

interface UserDirectoryListProps {
  dialog: ReturnType<typeof useNewChatDialog>;
}

const UserDirectoryList = ({ dialog }: UserDirectoryListProps) => {
  const { t } = useTranslation('chat');
  return (
    <div
      className="max-h-72 overflow-y-auto divide-y divide-rentify-divider"
      onScroll={(event) => dialog.loadMore(event.currentTarget)}
    >
      {dialog.users.map((person) => (
        <div key={person.id} className="flex items-center gap-3 py-2">
          {dialog.mode === 'group' && (
            <Checkbox
              checked={dialog.selected.includes(person.id)}
              onChange={() => dialog.toggleUser(person.id)}
              aria-label={person.name}
            />
          )}
          <Button
            type="button"
            variant="ghost"
            className="h-auto min-h-0 min-w-0 flex-1 justify-start gap-3 px-2 py-2 text-left"
            onClick={() => {
              if (dialog.mode === 'direct') dialog.selectDirect(person.id, person.name);
            }}
          >
            <Avatar name={person.name} size="sm" />
            <span className="truncate">{person.name}</span>
          </Button>
        </div>
      ))}
      <DirectoryStatus dialog={dialog} />
      {dialog.hasNextPage && !dialog.isLoadingMore && (
        <Button variant="ghost" size="sm" className="w-full" onClick={dialog.loadNextPage}>
          {t('loadMorePeople')}
        </Button>
      )}
    </div>
  );
};

const DirectoryStatus = ({ dialog }: UserDirectoryListProps) => {
  const { t } = useTranslation('chat');
  if (dialog.isLoading || dialog.isLoadingMore) {
    return <p className="py-3 text-center text-sm">{t('loadingPeople')}</p>;
  }
  if (dialog.isError) {
    return (
      <div role="alert" className="py-3 text-center">
        <p className="mb-2 text-sm text-rentify-error">{t('peopleError')}</p>
        <Button variant="ghost" size="sm" onClick={dialog.retryDirectory}>
          {t('tryLoadAgain')}
        </Button>
      </div>
    );
  }
  if (!dialog.users.length) {
    return <p className="py-4 text-center text-sm text-rentify-text-secondary">{t('noPeopleFound')}</p>;
  }
  return null;
};

interface GroupActionsProps {
  canCreate: boolean;
  isCreating: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

const GroupActions = ({ canCreate, isCreating, onCancel, onCreate }: GroupActionsProps) => {
  const { t } = useTranslation('chat');
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        {t('cancel')}
      </Button>
      <Button onClick={onCreate} disabled={!canCreate} isLoading={isCreating}>
        {t('createGroup')}
      </Button>
    </div>
  );
};
