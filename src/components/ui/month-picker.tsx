import { useRef } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils/cn';
import { formatMonth } from '@/lib/utils/format';

export interface MonthPickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * MonthPicker - Rentify base month selector wrapping a native month input
 * with consistent surface styling, press feedback, and optional clear button.
 */
export const MonthPicker = ({
  id,
  value,
  onChange,
  placeholder = '',
  clearable = false,
  clearLabel = 'Clear',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: MonthPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (disabled) return;
    const input = inputRef.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
        return;
      }
    } catch {
      // Fallback to focus/click when showPicker is blocked
    }
    input.focus();
    input.click();
  };

  return (
    <div
      className={cn(
        'relative flex min-h-11 items-center gap-1 rounded-xl border border-rentify-divider bg-rentify-surface px-2.5 py-1.5',
        'transition-colors duration-150 focus-within:border-rentify-primary focus-within:ring-2 focus-within:ring-rentify-primary/20 motion-reduce:transition-none',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="ui-press flex min-w-28 flex-1 cursor-pointer items-center gap-1.5 text-left text-xs font-medium text-rentify-text-primary disabled:cursor-not-allowed"
      >
        <Calendar className="h-4 w-4 shrink-0 text-rentify-primary" aria-hidden="true" />
        <span className="truncate">{value ? formatMonth(value) : placeholder}</span>
        <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-rentify-text-secondary" aria-hidden="true" />
      </button>

      <input
        ref={inputRef}
        id={id}
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />

      {clearable && value && !disabled && (
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          aria-label={clearLabel}
          className="h-6 w-6"
        >
          <X className="h-3.5 w-3.5" />
        </IconButton>
      )}
    </div>
  );
};
