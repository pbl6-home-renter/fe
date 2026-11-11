import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';

export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'secondary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  'aria-label': string; // Required for accessibility
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', isLoading = false, className, disabled, children, ...props }, ref) => {
    const baseStyles =
      'ui-press relative inline-flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const variantStyles: Record<IconButtonVariant, string> = {
      ghost:
        'bg-transparent text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-primary-container/60',
      outline:
        'border border-rentify-divider bg-rentify-surface text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background hover:border-rentify-primary/40',
      primary: 'bg-rentify-primary text-white hover:bg-rentify-primary-hover shadow-sm',
      secondary: 'bg-rentify-primary-container text-rentify-on-primary-container hover:bg-primary-fixed',
    };

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'h-10 w-10 rounded-lg text-sm md:h-8 md:w-8',
      md: 'w-10 h-10 rounded-xl text-base',
      lg: 'w-11 h-11 rounded-xl text-lg',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        <span className={isLoading ? 'opacity-0' : undefined}>{children}</span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
          </span>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
