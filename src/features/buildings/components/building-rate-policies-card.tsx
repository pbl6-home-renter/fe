import { useTranslation } from 'react-i18next';
import { Zap, Droplets, Wifi } from 'lucide-react';
import type { BuildingRatePolicyDto } from '../types/building.dto';

interface BuildingRatePoliciesCardProps {
  ratePolicies?: BuildingRatePolicyDto[];
}

export const BuildingRatePoliciesCard = ({ ratePolicies }: BuildingRatePoliciesCardProps) => {
  const { t } = useTranslation('buildings');

  return (
    <div className="bg-rentify-surface rounded-2xl p-6 border border-rentify-divider shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div>
          <h2 className="text-base font-bold text-rentify-text-primary">
            {t('detail.serviceRatesTitle')}
          </h2>
          <span className="text-xs text-rentify-text-secondary">
            {t('detail.serviceRatesSubtitle')}
          </span>
        </div>

        <span className="text-xs font-semibold text-rentify-primary bg-rentify-primary-container/20 px-2.5 py-1 rounded-lg">
          {t('detail.fixedRate')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ratePolicies && ratePolicies.length > 0 ? (
          ratePolicies.map((policy, idx) => (
            <div
              key={idx}
              className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-rentify-text-secondary">
                <span className="text-xs font-semibold">{policy.name}</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-rentify-text-primary">
                  {policy.unitPrice ? policy.unitPrice.toLocaleString('vi-VN') : '0'}
                </span>
                <span className="text-xs text-rentify-text-secondary">đ / {policy.unit}</span>
              </div>
              <span className="text-[11px] text-rentify-text-secondary">{policy.category || policy.rateKind}</span>
            </div>
          ))
        ) : (
          <>
            <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-rentify-text-secondary">
                <span className="text-xs font-semibold">{t('detail.electricityRate')}</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-rentify-text-primary">3.800</span>
                <span className="text-xs text-rentify-text-secondary">{t('detail.electricityUnit')}</span>
              </div>
              <span className="text-[11px] text-rentify-text-secondary">{t('detail.electricityNote')}</span>
            </div>

            <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-rentify-text-secondary">
                <span className="text-xs font-semibold">{t('detail.waterRate')}</span>
                <Droplets className="w-4 h-4 text-rentify-primary" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-rentify-text-primary">25.000</span>
                <span className="text-xs text-rentify-text-secondary">{t('detail.waterUnit')}</span>
              </div>
              <span className="text-[11px] text-rentify-text-secondary">{t('detail.waterNote')}</span>
            </div>

            <div className="bg-canvas-base border border-rentify-divider/60 rounded-xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-rentify-text-secondary">
                <span className="text-xs font-semibold">{t('detail.internetRate')}</span>
                <Wifi className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-rentify-text-primary">100.000</span>
                <span className="text-xs text-rentify-text-secondary">{t('detail.internetUnit')}</span>
              </div>
              <span className="text-[11px] text-rentify-text-secondary">{t('detail.internetNote')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
