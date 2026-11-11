import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { ProfileAvatarCard } from '../components/profile-avatar-card';
import { ProfileFormCard } from '../components/profile-form-card';
import { useMyProfileQuery } from '../hooks/use-my-profile-query';

export const ProfilePage = () => {
  const { t } = useTranslation('users');
  const query = useMyProfileQuery();
  const user = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-1" />
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (query.isError || !user) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('profile.title')} description={t('profile.subtitle')} />
        <ErrorState
          title={t('profile.error.title')}
          message={t('profile.error.description')}
          retryText={t('actions.retry')}
          onRetry={() => void query.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('profile.title')} description={t('profile.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileAvatarCard key={user.id} user={user} />
        </div>
        <div className="lg:col-span-2">
          <ProfileFormCard key={user.id} user={user} />
        </div>
      </div>
    </div>
  );
};
