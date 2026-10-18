import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type StatusDotVariant =
  | 'paid'
  | 'success'
  | 'overdue'
  | 'error'
  | 'pending'
  | 'neutral'
  | 'primary'
  | 'active';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusDotVariant;
  label?: string;
  pulse?: boolean;
}

const dotColorMap: Record<StatusDotVariant, string> = {
  paid: 'bg-rentify-success',
  success: 'bg-rentify-success',
  overdue: 'bg-rentify-error',
  error: 'bg-rentify-error',
  pending: 'bg-rentify-neutral',
  neutral: 'bg-rentify-neutral',
  primary: 'bg-rentify-primary',
  active: 'bg-rentify-primary',
};

export const StatusDot = ({
  variant = 'neutral',
  label,
  pulse = false,
  className,
  ...props
}: StatusDotProps) => {
  const dotColor = dotColorMap[variant] || 'bg-rentify-neutral';

  return (
    <span
      className={cn('inline-flex items-center gap-2 select-none', className)}
      {...props}
    >
      <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping',
              dotColor
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex w-[7px] h-[7px] rounded-full shrink-0',
            dotColor
          )}
        />
      </span>

      {label && (
        <span className="text-xs sm:text-sm font-medium text-rentify-text-primary leading-none">
          {label}
        </span>
      )}
    </span>
  );
};
