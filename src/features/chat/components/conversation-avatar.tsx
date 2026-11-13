import type { AvatarSize } from '@/components/ui/avatar';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';
import { UserAvatar } from '@/features/users/components/user-avatar';

interface ConversationAvatarProps {
  name: string;
  /** Group photo; direct chats have none, so they show the other person's initials. */
  avatarMediaId?: string | null;
  size?: AvatarSize;
  className?: string;
}

export const ConversationAvatar = ({ name, avatarMediaId, size = 'md', className }: ConversationAvatarProps) => (
  <UserAvatar
    name={name}
    src={avatarMediaId ? MEDIA_API_ROUTES.BY_ID(avatarMediaId) : null}
    size={size}
    className={className}
  />
);
