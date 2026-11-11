import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeVariant = 'default' | 'active' | 'success' | 'error' | 'warning' | 'primary' | 'secondary';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  interactive?: boolean;
  active?: boolean;
  leadingIcon?: ReactNode;
  children: ReactNode;
}

export const Badge = ({
  variant = 'default',
  interactive = false,
  active = false,
  leadingIcon,
  className,
  children,
  ...props
}: BadgeProps) => {
  const effectiveVariant = active ? 'active' : variant;

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'border-rentify-divider bg-rentify-surface text-rentify-text-secondary hover:border-rentify-outline/40',
    active: 'border-rentify-primary bg-rentify-primary/5 text-rentify-primary font-semibold',
    primary: 'border-rentify-primary/30 bg-rentify-primary-container text-rentify-primary font-medium',
    secondary: 'border-rentify-divider bg-rentify-surface-container-low text-rentify-text-primary',
    success: 'border-rentify-success/20 bg-rentify-success/10 text-rentify-success font-medium',
    error: 'border-rentify-error/20 bg-rentify-error/10 text-rentify-error font-medium',
    warning: 'border-rentify-warning/20 bg-rentify-warning/10 text-rentify-warning font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-tag border transition-colors duration-150 select-none leading-none',
        variantStyles[effectiveVariant],
        interactive && 'cursor-pointer hover:border-rentify-primary/60',
        className,
      )}
      {...props}
    >
      {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
      <span>{children}</span>
    </span>
  );
};
