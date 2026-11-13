import { Avatar, type AvatarProps } from '@/components/ui/avatar';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';

export interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'name' | 'alt' | 'colorSeed'> {
  /** Display name: drives the initials, the alt text and the stable fallback colour. */
  name?: string | null;
  /**
   * Photo URL as returned by the API: a public URL, or a private `/api/v1/media/{id}`
   * path that is fetched with the session token. Missing or broken photos fall back to initials.
   */
  src?: string | null;
}

/**
 * The one way to show a person (or a conversation) in the app: same initials,
 * same colour for the same name everywhere, and photo loading handled in one place.
 */
export const UserAvatar = ({ name, src, title, ...props }: UserAvatarProps) => {
  const media = useMediaObjectUrl(src, { signedDownload: true });
  const label = name?.trim() || undefined;
  return <Avatar {...props} src={media.src} name={label} alt={label} colorSeed={label} title={title ?? label} />;
};
