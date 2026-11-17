import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { LIFESTYLE_ITEMS } from '../../constants/roommate.constants';
import type { RoommateLifestyle } from '../../types/roommate.dto';

export interface RoommateLifestyleSelectorProps {
  lifestyle?: RoommateLifestyle | null;
  onToggle: (key: keyof RoommateLifestyle, value: boolean) => void;
}

export const RoommateLifestyleSelector = ({ lifestyle, onToggle }: RoommateLifestyleSelectorProps) => {
  const { t } = useTranslation('roommates');

  return (
    <Card className="p-6 rounded-2xl bg-rentify-card border border-rentify-divider space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-rentify-primary" />
        <h3 className="text-base font-bold text-rentify-text-primary">{t('profile.lifestyleTitle')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {LIFESTYLE_ITEMS.map((item) => {
          const Icon = item.icon;
          const checked = Boolean(lifestyle && lifestyle[item.key]);
          return (
            <div
              key={item.key}
              onClick={() => onToggle(item.key, !checked)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                checked
                  ? 'border-rentify-primary bg-rentify-primary-container/10 text-rentify-text-primary font-semibold'
                  : 'border-rentify-divider text-rentify-text-secondary hover:bg-rentify-surface-container-low/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-rentify-primary shrink-0" />
                <span>{t(item.labelKey)}</span>
              </div>
              <Checkbox checked={checked} onChange={(e) => onToggle(item.key, e.target.checked)} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
