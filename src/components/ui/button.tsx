import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rentify-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-rentify-primary text-rentify-on-primary hover:bg-rentify-primary-hover active:scale-[0.99] shadow-sm',
    secondary:
      'bg-rentify-primary-container text-rentify-on-primary-container hover:bg-[#d8e7fa] active:scale-[0.99]',
    outline:
      'border border-rentify-divider bg-rentify-surface text-rentify-text-secondary hover:bg-rentify-background hover:text-rentify-text-primary',
    ghost:
      'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-primary-container/50',
    danger:
      'bg-rentify-error text-white hover:bg-[#b91c1c] active:scale-[0.99] shadow-sm',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
  };

  const spinnerSizes = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  const spinnerColors = {
    primary: 'white' as const,
    secondary: 'primary' as const,
    outline: 'primary' as const,
    ghost: 'primary' as const,
    danger: 'white' as const,
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          size={spinnerSizes[size]}
          color={spinnerColors[variant]}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

