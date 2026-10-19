import {
  forwardRef,
  type TextareaHTMLAttributes,
  useState,
  type ChangeEvent,
} from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      containerClassName,
      className,
      id,
      disabled,
      maxLength,
      value,
      defaultValue,
      onChange,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId && error ? `${inputId}-error` : undefined;
    const helperId = inputId && helperText ? `${inputId}-helper` : undefined;

    const [charCount, setCharCount] = useState<number>(() => {
      const initial = value ?? defaultValue ?? '';
      return String(initial).length;
    });

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-rentify-text-primary"
            >
              {label}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-xs text-rentify-text-secondary tabular-nums ml-auto">
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            'w-full px-3.5 py-3 text-sm rounded-xl',
            'bg-rentify-surface text-rentify-text-primary',
            'border border-rentify-divider',
            'placeholder:text-rentify-neutral',
            'transition-all duration-200 outline-none resize-y',
            'focus:border-rentify-primary focus:ring-2 focus:ring-rentify-primary/20',
            disabled && 'bg-gray-50 opacity-60 cursor-not-allowed',
            error &&
              'border-rentify-error focus:border-rentify-error focus:ring-rentify-error/20',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
