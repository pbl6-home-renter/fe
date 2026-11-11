import { useTranslation } from 'react-i18next';
import { Bot, Calendar, Bell, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import type { BillingSettingDto, BillingSettingScope } from '../types/billing.dto';

export interface BillingSettingCardProps {
  setting?: BillingSettingDto | null;
  scope: BillingSettingScope;
  isLoading?: boolean;
  onConfigure: () => void;
}

export const BillingSettingCard = ({ setting, scope, isLoading, onConfigure }: BillingSettingCardProps) => {
  const { t } = useTranslation('billing');

  if (isLoading) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </Card>
    );
  }

  const hasSetting = Boolean(setting?.isActive);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rentify-divider">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-rentify-text-primary">{t('setting.title')}</h2>
            {scope === 'room' && !hasSetting && (
              <span className="text-xs font-semibold text-rentify-primary bg-rentify-primary-container/20 px-2 py-0.5 rounded-md">
                {t('setting.inheritedBadge')}
              </span>
            )}
          </div>
          <span className="text-xs text-rentify-text-secondary">{t('setting.subtitle')}</span>
        </div>

        <Button
          type="button"
          variant={hasSetting ? 'outline' : 'primary'}
          size="sm"
          onClick={onConfigure}
          className="gap-1.5 text-xs font-semibold"
        >
          {hasSetting ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('setting.editButton')}</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{t('setting.setupButton')}</span>
            </>
          )}
        </Button>
      </div>

      {!hasSetting && scope === 'room' ? (
        <div className="p-4 rounded-xl bg-rentify-surface border border-rentify-divider/70 text-xs text-rentify-text-secondary">
          {t('setting.roomInheritNotice')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-rentify-text-secondary">
              <span className="text-xs font-semibold">{t('setting.dueDayLabel')}</span>
              <Calendar className="w-4 h-4 text-rentify-primary" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-rentify-text-primary">{setting?.paymentDueDay ?? 5}</span>
              <span className="text-xs text-rentify-text-secondary">{t('setting.dayOfMonth')}</span>
            </div>
            <span className="text-[11px] text-rentify-text-secondary">{t('setting.dueDayHelp')}</span>
          </div>

          <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-rentify-text-secondary">
              <span className="text-xs font-semibold">{t('setting.remindDayLabel')}</span>
              <Bell className="w-4 h-4 text-rentify-warning" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-rentify-text-primary">{setting?.remindDay ?? '—'}</span>
              {setting?.remindDay && (
                <span className="text-xs text-rentify-text-secondary">{t('setting.dayOfMonth')}</span>
              )}
            </div>
            <span className="text-[11px] text-rentify-text-secondary">
              {setting?.remindDay ? t('setting.remindDayHelp') : t('setting.noRemindHelp')}
            </span>
          </div>

          <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-rentify-text-secondary">
              <span className="text-xs font-semibold">{t('setting.botLabel')}</span>
              <Bot className="w-4 h-4 text-rentify-success" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-rentify-text-primary">
                {setting?.botEnabled !== false ? t('setting.botEnabled') : t('setting.botDisabled')}
              </span>
            </div>
            <span className="text-[11px] text-rentify-text-secondary">{t('setting.botHelp')}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
