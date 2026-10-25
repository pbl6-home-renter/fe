import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'white' | 'neutral' | 'current';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'text-rentify-primary',
  white: 'text-white',
  neutral: 'text-rentify-neutral',
  current: 'text-current',
};

export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className,
  label,
  ...props
}: LoadingSpinnerProps) => {
  const { t } = useTranslation('common');
  const accessibleLabel = label ?? t('loading');

  return (
    <span
      role="status"
      aria-label={accessibleLabel}
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      {...props}
    >
      <svg
        className={cn('animate-spin', sizeClasses[size], colorClasses[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{accessibleLabel}</span>
    </span>
  );
};
