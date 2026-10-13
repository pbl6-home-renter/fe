import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
}

/**
 * Input component - Rentify design system input field with label,
 * leading/trailing icons, error text helper, and rentify-primary focus ring.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      className,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId && error ? `${inputId}-error` : undefined;
    const helperId = inputId && helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-rentify-text-primary,#142A4C)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--color-rentify-text-secondary,#5C7290)]">
              {leadingIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            className={cn(
              'w-full min-h-[42px] px-3.5 py-2.5 text-sm rounded-xl',
              'bg-[var(--color-rentify-surface,#FFFFFF)] text-[var(--color-rentify-text-primary,#142A4C)]',
              'border border-[var(--color-rentify-divider,#D7E3F2)]',
              'placeholder:text-[var(--color-rentify-neutral,#94A3B8)]',
              'transition-all duration-200 outline-none',
              'focus:border-[var(--color-rentify-primary,#1E6FD9)] focus:ring-2 focus:ring-[var(--color-rentify-primary,#1E6FD9)]/20',
              disabled && 'bg-gray-50 opacity-60 cursor-not-allowed',
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              error &&
                'border-[var(--color-rentify-error,#DC2626)] focus:border-[var(--color-rentify-error,#DC2626)] focus:ring-[var(--color-rentify-error,#DC2626)]/20',
              className
            )}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--color-rentify-text-secondary,#5C7290)]">
              {trailingIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-[var(--color-rentify-error,#DC2626)] mt-0.5"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-[var(--color-rentify-text-secondary,#5C7290)] mt-0.5"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

