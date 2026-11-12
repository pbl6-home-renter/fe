import { useCallback, useState } from 'react';
import { useUserDirectoryQuery } from './use-user-directory-query';
import { useCreateGroupMutation } from './use-chat-mutations';
import { CHAT_DIRECTORY_LOAD_MORE_THRESHOLD_PX } from '../constants/chat.constants';

interface UseNewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectDirect: (userId: string, name: string) => void;
  onGroupCreated: (conversationId: string) => void;
}

export const useNewChatDialog = ({ open, onClose, onSelectDirect, onGroupCreated }: UseNewChatDialogProps) => {
  const [mode, setMode] = useState<'choose' | 'direct' | 'group'>('choose');
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const directory = useUserDirectoryQuery(search, open && mode !== 'choose');
  const createGroup = useCreateGroupMutation();
  const users = directory.isSearchPending ? [] : (directory.data?.pages.flatMap((page) => page.items) ?? []);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = directory;

  const close = () => {
    setMode('choose');
    setSearch('');
    setTitle('');
    setSelected([]);
    onClose();
  };
  const toggleUser = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((userId) => userId !== id) : [...current, id]));
  const loadMore = useCallback(
    (element: HTMLDivElement) => {
      if (
        element.scrollTop + element.clientHeight >= element.scrollHeight - CHAT_DIRECTORY_LOAD_MORE_THRESHOLD_PX &&
        hasNextPage &&
        !directory.isSearchPending &&
        !isFetchingNextPage
      )
        void fetchNextPage();
    },
    [directory.isSearchPending, fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const selectDirect = (userId: string, name: string) => {
    close();
    onSelectDirect(userId, name);
  };
  const createSelectedGroup = async () => {
    try {
      const conversation = await createGroup.mutateAsync({
        kind: 'group',
        memberUserIds: selected,
        ...(title.trim() ? { title: title.trim() } : {}),
      });
      close();
      onGroupCreated(conversation.id);
    } catch {
      // The mutation reports the request error to the user.
    }
  };

  return {
    mode,
    setMode,
    search,
    setSearch,
    title,
    setTitle,
    selected,
    users,
    isLoading: directory.isLoading || directory.isSearchPending,
    isLoadingMore: directory.isFetchingNextPage,
    hasNextPage: !directory.isSearchPending && hasNextPage,
    isError: !directory.isSearchPending && directory.isError,
    isCreating: createGroup.isPending,
    close,
    loadMore,
    loadNextPage: () => void fetchNextPage(),
    toggleUser,
    selectDirect,
    createSelectedGroup,
    retryDirectory: () => void directory.refetch(),
  };
};
