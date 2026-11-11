import type { ReactNode } from 'react';
import { Button, type ButtonSize } from './button';
import { cn } from '@/lib/utils/cn';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}

export const SegmentedControl = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  size = 'sm',
  disabled,
  className,
  itemClassName,
}: SegmentedControlProps<T>) => (
  <div
    role="group"
    aria-label={label}
    className={cn('inline-flex items-center gap-1 rounded-xl bg-surface-container-low p-1', className)}
  >
    {options.map((option) => (
      <Button
        key={option.value}
        type="button"
        size={size}
        variant={value === option.value ? 'secondary' : 'ghost'}
        aria-pressed={value === option.value}
        disabled={disabled}
        onClick={() => onChange(option.value)}
        className={cn('min-w-0 rounded-lg px-3 text-xs font-semibold', itemClassName)}
      >
        {option.icon}
        <span>{option.label}</span>
      </Button>
    ))}
  </div>
);
