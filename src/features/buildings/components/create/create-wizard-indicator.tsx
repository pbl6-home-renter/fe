import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface CreateWizardIndicatorProps {
  step: number;
}

export const CreateWizardIndicator = ({ step }: CreateWizardIndicatorProps) => {
  const { t } = useTranslation('buildings');

  return (
    <div className="w-full bg-surface-container-low rounded-xl p-3 border border-rentify-divider">
      <div className="grid grid-cols-2 gap-3">
        <div className={`flex items-center gap-2.5 ${step === 1 ? 'opacity-100' : 'opacity-80'}`}>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
              step === 1
                ? 'bg-rentify-primary text-white shadow-xs'
                : 'bg-rentify-success/10 text-rentify-success border border-rentify-success/30'
            }`}
          >
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-rentify-primary uppercase tracking-wider">
              {t('wizard.step1Badge')}
            </span>
            <span className="font-semibold text-xs text-rentify-text-primary truncate">
              {t('wizard.step1Title')}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-2.5 ${step === 2 ? 'opacity-100' : 'opacity-60'}`}>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
              step === 2
                ? 'bg-rentify-primary text-white shadow-xs'
                : 'bg-surface-container-low text-rentify-text-secondary border border-rentify-divider'
            }`}
          >
            2
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-rentify-text-secondary uppercase tracking-wider">
              {t('wizard.step2Badge')}
            </span>
            <span className="font-semibold text-xs text-rentify-text-primary truncate">
              {t('wizard.step2Title')}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-rentify-primary h-full rounded-full transition-all duration-300"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  );
};
