import { useTranslation } from 'react-i18next';
import { Camera, Mail, X } from 'lucide-react';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { UserStatus } from '@/types/user';
import { useProfileAvatar } from '../hooks/use-profile-avatar';
import type { UserMeResponseDto } from '../types/users.dto';
import { UserRoleBadge } from './admin/user-role-badge';
import { UserStatusBadge } from './admin/user-status-badge';

export interface ProfileAvatarCardProps {
  user: UserMeResponseDto;
}

export const ProfileAvatarCard = ({ user }: ProfileAvatarCardProps) => {
  const { t } = useTranslation('users');
  const { fileInputRef, isUploading, progress, cancelUpload, openFilePicker, handleFileChange } = useProfileAvatar(
    user.id,
  );

  const isLocked = user.status === UserStatus.LOCKED;

  return (
    <Card>
      <CardContent className="flex flex-col items-center space-y-5 pt-4 text-center">
        <Avatar
          src={user.avatarUrl}
          name={user.name}
          alt={user.name}
          size="2xl"
          className="ring-4 ring-rentify-primary-container shadow-card"
        />

        <div className="w-full space-y-1.5">
          <h2 className="truncate text-lg font-bold text-rentify-text-primary">{user.name}</h2>
          <p className="flex items-center justify-center gap-1.5 truncate text-sm text-rentify-text-secondary">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <UserRoleBadge role={user.role} />
          <UserStatusBadge status={user.status} />
        </div>

        <Divider className="my-1" />

        <div className="w-full space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={getMediaAccept(MediaPurpose.AVATAR)}
            onChange={handleFileChange}
            className="hidden"
            aria-label={t('profile.avatar.uploadAction')}
          />

          <Button
            type="button"
            variant="outline"
            onClick={openFilePicker}
            disabled={isUploading}
            isLoading={isUploading}
            className="w-full gap-2"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            <span>{user.avatarUrl ? t('profile.avatar.changeAction') : t('profile.avatar.uploadAction')}</span>
          </Button>

          {isUploading && (
            <div className="flex items-center gap-2">
              <ProgressMeterTrack
                value={progress}
                label={t('profile.avatar.uploading')}
                showValue
                size="sm"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelUpload}
                aria-label={t('profile.avatar.cancelUpload')}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="text-xs text-rentify-text-secondary">{t('profile.avatar.hint')}</p>
        </div>

        {isLocked && (
          <AlertBanner variant="warning" title={t('profile.lockedNotice.title')}>
            <span className="text-sm">{user.lockReason || t('profile.lockedNotice.defaultReason')}</span>
          </AlertBanner>
        )}
      </CardContent>
    </Card>
  );
};
