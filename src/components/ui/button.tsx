import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner, type SpinnerColor, type SpinnerSize } from '@/components/feedback/loading-spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const BASE_STYLES =
  'ui-press relative inline-flex items-center justify-center font-medium rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-rentify-primary text-rentify-on-primary hover:bg-rentify-primary-hover shadow-sm',
  secondary: 'bg-rentify-primary-container text-rentify-on-primary-container hover:bg-primary-fixed',
  outline:
    'border border-rentify-divider bg-rentify-surface text-rentify-text-secondary hover:bg-rentify-background hover:text-rentify-text-primary',
  ghost: 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-primary-container/50',
  danger: 'bg-rentify-error text-white hover:bg-rentify-error/90 shadow-sm',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-10 md:min-h-8',
  md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
  lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
};

const SPINNER_SIZES: Record<ButtonSize, SpinnerSize> = { sm: 'sm', md: 'sm', lg: 'md' };
const CONTENT_GAPS: Record<ButtonSize, string> = { sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' };

const SPINNER_COLORS: Record<ButtonVariant, SpinnerColor> = {
  primary: 'white',
  secondary: 'primary',
  outline: 'primary',
  ghost: 'primary',
  danger: 'white',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', disabled, children, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        <span className={cn('inline-flex items-center justify-center', CONTENT_GAPS[size], isLoading && 'opacity-0')}>
          {children}
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <LoadingSpinner size={SPINNER_SIZES[size]} color={SPINNER_COLORS[variant]} />
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
