import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProgressMeterProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100 or relative to max
  max?: number;
  label?: string;
  showValue?: boolean;
  warningThreshold?: number; // default 100
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'success' | 'warning';
}

export const ProgressMeterTrack = ({
  value,
  max = 100,
  label,
  showValue = false,
  warningThreshold = 100,
  size = 'md',
  tone = 'primary',
  className,
  ...props
}: ProgressMeterProps) => {
  const percentage = Number.isFinite(value) && max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const isOverThreshold = percentage >= warningThreshold;

  const heightMap = {
    sm: 'h-1.5', // 6px
    md: 'h-2', // 8px
    lg: 'h-3', // 12px
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5 text-left', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium text-rentify-text-secondary select-none">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="tabular-nums font-semibold text-rentify-text-primary ml-auto">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('w-full bg-rentify-divider rounded-full overflow-hidden', heightMap[size])}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none',
            isOverThreshold
              ? 'bg-rentify-error'
              : tone === 'success'
                ? 'bg-rentify-success'
                : tone === 'warning'
                  ? 'bg-rentify-warning'
                  : 'bg-rentify-primary',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
