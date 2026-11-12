import { useTranslation } from 'react-i18next';
import { BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/feedback/skeleton';
import { useNotificationPreferences } from '../hooks/use-notification-preferences';

interface NotificationPreferencesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationPreferencesDialog = ({ open, onClose }: NotificationPreferencesDialogProps) => {
  const { t } = useTranslation('notifications');
  const preferences = useNotificationPreferences(open);

  return (
    <Dialog open={open} onClose={onClose} title={t('preferences.title')} description={t('preferences.description')}>
      {preferences.isLoading ? (
        <div className="space-y-1" role="status" aria-label={t('loading')}>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex h-12 items-center justify-between gap-4 border-b border-rentify-divider last:border-0"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          ))}
        </div>
      ) : preferences.isError ? (
        <div role="alert" className="py-4">
          <p className="mb-3 text-sm text-rentify-error">{t('preferences.loadError')}</p>
          <Button variant="outline" size="sm" onClick={preferences.retry}>
            {t('retry')}
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-rentify-divider">
          {preferences.values.map(({ type, pushEnabled }) => (
            <div key={type} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <BellRing className="h-4 w-4 text-rentify-primary" aria-hidden="true" />
                <span className="text-sm font-medium">{t(`categories.${type}`)}</span>
              </div>
              <Checkbox
                id={`notification-push-${type}`}
                label={t('preferences.pushFor', { category: t(`categories.${type}`) })}
                checked={pushEnabled}
                disabled={preferences.isSaving}
                onChange={(event) => preferences.onToggle(type, event.target.checked)}
              />
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};
