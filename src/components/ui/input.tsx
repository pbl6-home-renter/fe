import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
    { label, error, helperText, leadingIcon, trailingIcon, className, containerClassName, id, disabled, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = inputId && error ? `${inputId}-error` : undefined;
    const helperId = inputId && helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-rentify-text-primary">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-rentify-text-secondary">
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
              'w-full min-h-10.5 px-3.5 py-2.5 text-sm rounded-xl',
              'bg-rentify-surface text-rentify-text-primary',
              'border border-rentify-divider',
              'placeholder:text-rentify-neutral',
              'transition-[border-color,box-shadow] duration-150 outline-none motion-reduce:transition-none',
              'focus:border-rentify-primary focus:ring-2 focus:ring-rentify-primary/20',
              disabled && 'bg-surface-container-low opacity-60 cursor-not-allowed',
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              error &&
                'border-rentify-error hover:border-rentify-error focus:border-rentify-error focus:ring-2 focus:ring-rentify-error/20',
              className,
            )}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center text-rentify-text-secondary">{trailingIcon}</div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-1.5 text-xs font-medium text-rentify-error mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-rentify-text-secondary mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
