import { useMemo, useState } from 'react';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { useUserDirectoryQuery } from './use-user-directory-query';
import { useConversationQuery } from './use-chat-queries';
import { useAddConversationMembersMutation } from './use-add-conversation-members-mutation';
import { useLeaveConversationMutation } from './use-leave-conversation-mutation';
import { useRemoveConversationMemberMutation } from './use-remove-conversation-member-mutation';
import { useUpdateConversationMemberRoleMutation } from './use-update-conversation-member-role-mutation';
import { useUpdateConversationMetadataMutation } from './use-update-conversation-metadata-mutation';
import { useUpdateGroupAvatarMutation } from './use-update-group-avatar-mutation';
import type { ConversationMember } from '../types/chat.dto';

type GroupConfirmation = { type: 'leave' } | { type: 'remove'; member: ConversationMember };

interface UseGroupManagementOptions {
  conversationId: string;
  currentUserId?: string;
  open: boolean;
  onClose: () => void;
  onLeft: () => void;
}

export const useGroupManagement = ({
  conversationId,
  currentUserId,
  open,
  onClose,
  onLeft,
}: UseGroupManagementOptions) => {
  const [title, setTitle] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<GroupConfirmation>();
  const detail = useConversationQuery(conversationId, { enabled: open });
  const conversation = detail.data;
  const currentMember = conversation?.members.find((member) => member.userId === currentUserId);
  const isAdmin = currentMember?.status === 'active' && currentMember.role === 'admin';
  const directory = useUserDirectoryQuery(search, open && isAdmin);
  const activeMembers =
    conversation?.members.filter((member) => member.participantType === 'user' && member.status === 'active') ?? [];
  const adminCount = activeMembers.filter((member) => member.role === 'admin').length;
  const activeUserIds = useMemo(
    () =>
      new Set(
        conversation?.members
          .filter((member) => member.status === 'active')
          .map((member) => member.userId)
          .filter(Boolean),
      ),
    [conversation?.members],
  );
  const candidates = directory.isSearchPending
    ? []
    : (directory.data?.pages.flatMap((page) => page.items).filter((person) => !activeUserIds.has(person.id)) ?? []);
  const avatar = useMediaObjectUrl(conversation?.avatarMediaId ? `/media/${conversation.avatarMediaId}` : undefined, {
    signedDownload: true,
  });
  const addMembers = useAddConversationMembersMutation({ onSuccess: () => setSelectedIds([]) });
  const leave = useLeaveConversationMutation({
    onSuccess: () => {
      setConfirmation(undefined);
      onClose();
      onLeft();
    },
  });
  const removeMember = useRemoveConversationMemberMutation({ onSuccess: () => setConfirmation(undefined) });
  const updateRole = useUpdateConversationMemberRoleMutation();
  const updateMetadata = useUpdateConversationMetadataMutation();
  const updateAvatar = useUpdateGroupAvatarMutation();

  const handleSaveTitle = () => {
    if (title === undefined) return;
    updateMetadata.mutate(
      { conversationId, body: { title: title.trim() || null } },
      {
        onSuccess: () => setTitle(undefined),
      },
    );
  };

  const handleAddSelected = () => {
    if (selectedIds.length) addMembers.mutate({ conversationId, userIds: selectedIds });
  };

  const handleConfirm = () => {
    if (!confirmation) return;
    if (confirmation.type === 'leave') {
      leave.mutate(conversationId);
      return;
    }
    if (confirmation.member.userId) {
      removeMember.mutate({ conversationId, userId: confirmation.member.userId });
    }
  };

  const handleAvatarChange = (file?: File) => {
    if (file) updateAvatar.mutate({ conversationId, file });
  };

  const handleRemoveAvatar = () => updateMetadata.mutate({ conversationId, body: { avatarMediaId: null } });
  const handleRoleChange = (userId: string, role: 'admin' | 'member') =>
    updateRole.mutate({ conversationId, userId, role });

  return {
    detail,
    conversation,
    title,
    search,
    selectedIds,
    confirmation,
    candidates,
    activeMembers,
    adminCount,
    isAdmin,
    avatarSrc: avatar.src,
    isLoading: detail.isLoading,
    isDirectoryLoading: directory.isLoading || directory.isFetchingNextPage || directory.isSearchPending,
    isDirectoryError: !directory.isSearchPending && directory.isError,
    hasMoreCandidates: !directory.isSearchPending && directory.hasNextPage,
    isSavingTitle: updateMetadata.isPending,
    isUploadingAvatar: updateAvatar.isPending,
    isActing:
      addMembers.isPending ||
      leave.isPending ||
      removeMember.isPending ||
      updateRole.isPending ||
      updateMetadata.isPending ||
      updateAvatar.isPending,
    retry: () => void detail.refetch(),
    retryDirectory: () => void directory.refetch(),
    loadMoreCandidates: () => void directory.fetchNextPage(),
    onTitleChange: setTitle,
    onSearchChange: setSearch,
    onToggleUser: (userId: string, checked: boolean) =>
      setSelectedIds((ids) => (checked ? [...ids, userId] : ids.filter((id) => id !== userId))),
    onSaveTitle: handleSaveTitle,
    onAddSelected: handleAddSelected,
    onAvatarChange: handleAvatarChange,
    onRemoveAvatar: handleRemoveAvatar,
    onRoleChange: handleRoleChange,
    onRequestLeave: () => setConfirmation({ type: 'leave' }),
    onRequestRemove: (member: ConversationMember) => setConfirmation({ type: 'remove', member }),
    onConfirm: handleConfirm,
    onCancelConfirmation: () => setConfirmation(undefined),
  };
};
