import { useAuthStore } from '@/stores/auth-store';
import { UserAvatar, type UserAvatarProps } from './user-avatar';

export type CurrentUserAvatarProps = Omit<UserAvatarProps, 'name' | 'src'>;

/** Signed-in user's avatar; follows the session so a new photo shows everywhere at once. */
export const CurrentUserAvatar = (props: CurrentUserAvatarProps) => {
  const name = useAuthStore((state) => state.user?.name);
  const avatarUrl = useAuthStore((state) => state.user?.avatarUrl);
  return <UserAvatar {...props} name={name} src={avatarUrl} />;
};
