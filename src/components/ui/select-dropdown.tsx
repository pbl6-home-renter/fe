import {
  forwardRef,
  type SelectHTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  leadingIcon?: ReactNode;
}

export const SelectDropdown = forwardRef<HTMLSelectElement, SelectDropdownProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      containerClassName,
      className,
      id,
      disabled,
      leadingIcon,
      value,
      defaultValue,
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
            className="text-sm font-medium text-rentify-text-primary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-rentify-text-secondary">
              {leadingIcon}
            </div>
          )}

          <select
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              'w-full min-h-10.5 px-3.5 py-2.5 text-sm rounded-xl appearance-none pr-10',
              'bg-rentify-surface text-rentify-text-primary',
              'border border-rentify-divider',
              'transition-all duration-200 outline-none cursor-pointer',
              'focus:border-rentify-primary focus:ring-2 focus:ring-rentify-primary/20',
              disabled && 'bg-gray-50 opacity-60 cursor-not-allowed',
              leadingIcon && 'pl-10',
              error &&
                'border-rentify-error focus:border-rentify-error focus:ring-rentify-error/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-rentify-neutral">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="text-rentify-text-primary bg-rentify-surface py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-rentify-text-secondary">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-rentify-error mt-0.5"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-rentify-text-secondary mt-0.5"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

SelectDropdown.displayName = 'SelectDropdown';
