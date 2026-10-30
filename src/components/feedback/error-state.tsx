import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  retryText?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ErrorState = ({
  icon: Icon = AlertCircle,
  title,
  message,
  retryText,
  onRetry,
  isRetrying = false,
  className,
  children,
}: ErrorStateProps) => {
  const { t } = useTranslation('common');

  const displayTitle = title ?? t('error');
  const displayMessage = message ?? t('errorDefault');
  const displayRetryText = retryText ?? t('retry');

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 w-full',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-red-50 text-rentify-error flex items-center justify-center mb-4 transition-transform hover:scale-105">
        <Icon className="w-8 h-8" aria-hidden="true" strokeWidth={1.8} />
      </div>

      <h3 className="text-lg font-semibold text-rentify-text-primary mb-1.5 tracking-tight">
        {displayTitle}
      </h3>

      <p className="text-sm text-rentify-text-secondary max-w-sm leading-relaxed mb-6">
        {displayMessage}
      </p>

      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          isLoading={isRetrying}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{displayRetryText}</span>
        </Button>
      )}

      {children}
    </div>
  );
};
