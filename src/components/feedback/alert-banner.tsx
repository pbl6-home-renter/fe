import { useState, type ReactNode, type HTMLAttributes } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertBannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  {
    container: string;
    iconColor: string;
    Icon: typeof Info;
  }
> = {
  success: {
    container: 'bg-green-50/80 border-green-200 text-green-900',
    iconColor: 'text-rentify-success',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-red-50/80 border-red-200 text-red-900',
    iconColor: 'text-rentify-error',
    Icon: AlertTriangle,
  },
  warning: {
    container: 'bg-amber-50/80 border-amber-200 text-amber-900',
    iconColor: 'text-rentify-warning',
    Icon: AlertCircle,
  },
  info: {
    container: 'bg-rentify-primary-container/60 border-rentify-divider text-rentify-on-primary-container',
    iconColor: 'text-rentify-primary',
    Icon: Info,
  },
};

export const AlertBanner = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  className,
  ...props
}: AlertBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  const config = variantConfig[variant] || variantConfig.info;
  const { Icon, iconColor, container } = config;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200',
        container,
        className
      )}
      {...props}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColor)} aria-hidden="true" />

      <div className="flex-1 flex flex-col gap-0.5 text-sm">
        {title && <span className="font-semibold tracking-tight">{title}</span>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">{children}</div>
      </div>

      {action && <div className="shrink-0 ml-2">{action}</div>}

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
