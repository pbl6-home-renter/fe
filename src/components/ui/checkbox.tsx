import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  helperText?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      indeterminate = false,
      className,
      id,
      disabled,
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-2.5 select-none text-left cursor-pointer group',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={onChange}
            className={cn(
              'peer appearance-none w-[18px] h-[18px] rounded-[4px] border border-rentify-divider',
              'bg-rentify-surface transition-all duration-150',
              'checked:bg-rentify-primary checked:border-rentify-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary/30 focus-visible:ring-offset-1',
              'group-hover:border-rentify-primary/60',
              disabled && 'border-gray-300 checked:bg-gray-400 group-hover:border-gray-300',
              className
            )}
            {...props}
          />

          {/* Checked Tick Icon */}
          <Check
            className={cn(
              'w-3.5 h-3.5 text-white pointer-events-none absolute transition-opacity duration-150 stroke-[3]',
              checked && !indeterminate ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden="true"
          />

          {/* Indeterminate Minus Icon */}
          {indeterminate && (
            <Minus
              className="w-3.5 h-3.5 text-white pointer-events-none absolute opacity-100 stroke-[3]"
              aria-hidden="true"
            />
          )}
        </div>

        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-rentify-text-primary leading-tight">
                {label}
              </span>
            )}
            {helperText && (
              <span className="text-xs text-rentify-text-secondary mt-0.5">
                {helperText}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
