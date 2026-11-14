import type { AvatarSize } from '@/components/ui/avatar';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';
import { UserAvatar } from '@/features/users/components/user-avatar';

interface ConversationAvatarProps {
  name: string;
  /** Group photo; wins over `avatarUrl` so a freshly changed group photo shows at once. */
  avatarMediaId?: string | null;
  /** Direct chats: the other person's avatar. Missing → initials. */
  avatarUrl?: string | null;
  size?: AvatarSize;
  className?: string;
}

export const ConversationAvatar = ({
  name,
  avatarMediaId,
  avatarUrl,
  size = 'md',
  className,
}: ConversationAvatarProps) => (
  <UserAvatar
    name={name}
    src={avatarMediaId ? MEDIA_API_ROUTES.BY_ID(avatarMediaId) : (avatarUrl ?? null)}
    size={size}
    className={className}
  />
);
