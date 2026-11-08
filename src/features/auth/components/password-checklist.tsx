import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getPasswordCriteria } from '../utils/password-criteria';

export interface PasswordChecklistProps {
  password?: string;
  className?: string;
}

export const PasswordChecklist = ({ password = '', className }: PasswordChecklistProps) => {
  const { t } = useTranslation('auth');
  const criteria = getPasswordCriteria(password);

  return (
    <div
      className={cn(
        'p-3 rounded-xl bg-surface-container-low/70 border border-rentify-divider/60 text-left transition-all',
        className,
      )}
      aria-label={t('passwordCriteriaTitle')}
    >
      <p className="text-xs font-semibold text-rentify-text-secondary mb-2">{t('passwordCriteriaTitle')}</p>
      <ul className="space-y-1.5" role="list">
        {criteria.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors duration-150',
              item.met ? 'text-rentify-success font-medium' : 'text-rentify-text-secondary',
            )}
          >
            {item.met ? (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rentify-success/15 text-rentify-success shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rentify-warning/15 text-rentify-warning shrink-0">
                <X className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
              </span>
            )}
            <span>{t(item.labelKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
