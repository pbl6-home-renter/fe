import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Droplets, Wifi, Sparkles, Car, Wrench, HelpCircle } from 'lucide-react';
import type { RateType } from '../types/billing.dto';

interface RateItemBadgeProps {
  type: RateType;
}

const ICONS: Record<RateType, ReactNode> = {
  electricity: <Zap className="w-4 h-4 text-rentify-warning" />,
  water: <Droplets className="w-4 h-4 text-rentify-primary" />,
  wifi: <Wifi className="w-4 h-4 text-rentify-primary" />,
  cleaning: <Sparkles className="w-4 h-4 text-rentify-success" />,
  parking: <Car className="w-4 h-4 text-rentify-primary" />,
  maintenance: <Wrench className="w-4 h-4 text-rentify-text-secondary" />,
  other: <HelpCircle className="w-4 h-4 text-rentify-text-secondary" />,
};

export const RateItemBadge = ({ type }: RateItemBadgeProps) => {
  const { t } = useTranslation('billing');
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rentify-text-primary">
      {ICONS[type] ?? ICONS.other}
      <span>{t(`rateTypes.${type}`)}</span>
    </span>
  );
};
