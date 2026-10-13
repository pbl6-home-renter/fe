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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-rentify-primary,#1E6FD9)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--color-rentify-primary,#1E6FD9)] text-[var(--color-rentify-on-primary,#FFFFFF)] hover:bg-[var(--color-rentify-primary-hover,#175BB3)] active:scale-[0.99] shadow-sm',
    secondary:
      'bg-[var(--color-rentify-primary-container,#E8F1FC)] text-[var(--color-rentify-on-primary-container,#142A4C)] hover:bg-[#d8e7fa] active:scale-[0.99]',
    outline:
      'border border-[var(--color-rentify-divider,#D7E3F2)] bg-[var(--color-rentify-surface,#FFFFFF)] text-[var(--color-rentify-text-secondary,#5C7290)] hover:bg-[var(--color-rentify-background,#F8FBFE)] hover:text-[var(--color-rentify-text-primary,#142A4C)]',
    ghost:
      'text-[var(--color-rentify-text-secondary,#5C7290)] hover:text-[var(--color-rentify-text-primary,#142A4C)] hover:bg-[var(--color-rentify-primary-container,#E8F1FC)]/50',
    danger:
      'bg-[var(--color-rentify-error,#DC2626)] text-white hover:bg-[#b91c1c] active:scale-[0.99] shadow-sm',
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

export default Button;
