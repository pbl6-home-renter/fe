import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackLink } from '@/components/ui/back-link';
import { PageHeader } from '@/components/ui/page-header';
import { ROUTES } from '@/config/routes.config';
import { RoommateProfileForm } from '../components/profile/roommate-profile-form';

export const RoommateProfilePage = () => {
  const { t } = useTranslation('roommates');
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <div>
        <BackLink to={ROUTES.TENANT.ROOMMATES}>{t('profile.backToRoommates')}</BackLink>
      </div>

      <PageHeader title={t('profile.pageTitle')} description={t('profile.pageSubtitle')} />

      <RoommateProfileForm onSuccess={() => navigate(ROUTES.TENANT.ROOMMATES)} />
    </div>
  );
};
