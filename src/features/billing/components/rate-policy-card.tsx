import { useTranslation } from 'react-i18next';
import { AlertCircle, Edit3, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { AlertBanner } from '@/components/feedback/alert-banner';
import type { RatePolicyDto, RatePolicyScope } from '../types/billing.dto';
import { RateItemBadge } from './rate-item-badge';

export interface RatePolicyCardProps {
  policy?: RatePolicyDto | null;
  scope: RatePolicyScope;
  isLoading?: boolean;
  onConfigure: () => void;
  onDeactivate?: () => void;
  isDeactivating?: boolean;
}

export const RatePolicyCard = ({
  policy,
  scope,
  isLoading,
  onConfigure,
  onDeactivate,
  isDeactivating,
}: RatePolicyCardProps) => {
  const { t } = useTranslation('billing');

  if (isLoading) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </Card>
    );
  }

  const hasRates = Boolean(policy?.isActive && policy?.rates?.length);

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rentify-divider">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-rentify-text-primary">{t('ratePolicy.title')}</h2>
            {scope === 'room' && !hasRates && (
              <span className="text-xs font-semibold text-rentify-primary bg-rentify-primary-container/20 px-2 py-0.5 rounded-md">
                {t('ratePolicy.inheritedBadge')}
              </span>
            )}
          </div>
          <span className="text-xs text-rentify-text-secondary">{t('ratePolicy.subtitle')}</span>
        </div>

        <div className="flex items-center gap-2">
          {scope === 'room' && hasRates && onDeactivate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isDeactivating}
              onClick={onDeactivate}
              className="gap-1.5 text-xs text-rentify-text-secondary"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('ratePolicy.revertInherit')}</span>
            </Button>
          )}

          <Button
            type="button"
            variant={hasRates ? 'outline' : 'primary'}
            size="sm"
            onClick={onConfigure}
            className="gap-1.5 text-xs font-semibold"
          >
            {hasRates ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('ratePolicy.editButton')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t('ratePolicy.setupButton')}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {!hasRates ? (
        scope === 'room' ? (
          <div className="p-4 rounded-xl bg-rentify-surface border border-rentify-divider/70 flex flex-col gap-2">
            <p className="text-xs text-rentify-text-secondary">{t('ratePolicy.roomInheritNotice')}</p>
          </div>
        ) : (
          <AlertBanner variant="warning" title={t('ratePolicy.missingRatesTitle')}>
            <div className="flex items-start gap-2 mt-1 text-xs">
              <AlertCircle className="w-4 h-4 text-rentify-warning shrink-0 mt-0.5" />
              <p>{t('ratePolicy.missingRatesDesc')}</p>
            </div>
          </AlertBanner>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policy!.rates.map((rate, idx) => (
            <div
              key={`${rate.type}-${idx}`}
              className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <RateItemBadge type={rate.type} />
                <span className="text-[11px] text-rentify-text-secondary font-medium">
                  {t(`rateKinds.${rate.rateKind}`)}
                </span>
              </div>

              {rate.rateKind === 'tiered' && rate.steps?.length ? (
                <div className="space-y-1 my-1">
                  {rate.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex justify-between text-xs text-rentify-text-secondary">
                      <span>
                        {step.from}
                        {step.to !== null ? ` - ${step.to}` : '+'} {t(`billingUnits.${rate.billingUnit}`)}:
                      </span>
                      <span className="font-semibold text-rentify-text-primary">
                        {Number(step.price).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-rentify-text-primary">
                    {rate.unitPrice ? Number(rate.unitPrice).toLocaleString('vi-VN') : '0'}
                  </span>
                  <span className="text-xs text-rentify-text-secondary">
                    đ / {t(`billingUnits.${rate.billingUnit}`)}
                  </span>
                </div>
              )}

              <span className="text-[11px] text-rentify-text-secondary truncate">{rate.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
