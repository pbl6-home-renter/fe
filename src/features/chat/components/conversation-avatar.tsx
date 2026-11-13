import { Avatar, type AvatarSize } from '@/components/ui/avatar';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';

interface ConversationAvatarProps {
  name: string;
  /** Stable seed for the initials colour, e.g. the conversation or user id. */
  seed: string;
  avatarMediaId?: string | null;
  size?: AvatarSize;
  className?: string;
}

/** Group photo when one is set, otherwise coloured initials (users have no photo yet). */
export const ConversationAvatar = ({ name, seed, avatarMediaId, size = 'md', className }: ConversationAvatarProps) => {
  const media = useMediaObjectUrl(avatarMediaId ? MEDIA_API_ROUTES.BY_ID(avatarMediaId) : undefined, {
    signedDownload: true,
  });
  return <Avatar src={media.src} alt={name} name={name} colorSeed={seed} size={size} className={className} />;
};
