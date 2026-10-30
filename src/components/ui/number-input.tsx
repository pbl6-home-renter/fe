import {
  useState,
  useEffect,
  forwardRef,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import { cn } from '@/lib/utils/cn';
import { Input, type InputProps } from './input';

export interface NumberInputProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number | null;
  defaultValue?: number | null;
  onChangeValue?: (value: number | undefined) => void;
  formatVnd?: boolean;
  unitSuffix?: string;
  min?: number;
  max?: number;
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue,
      onChangeValue,
      formatVnd = false,
      unitSuffix,
      min,
      max,
      className,
      trailingIcon,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(() => {
      const initial = value ?? defaultValue;
      return initial !== undefined && initial !== null ? formatNumber(initial) : '';
    });
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused && value !== undefined) {
        setDisplayValue(value !== null ? formatNumber(value) : '');
      }
    }, [value, isFocused]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Remove all non-digits
      const rawText = e.target.value.replace(/\D/g, '');
      if (!rawText) {
        setDisplayValue('');
        onChangeValue?.(undefined);
        return;
      }

      let numericVal = parseInt(rawText, 10);
      if (max !== undefined && numericVal > max) {
        numericVal = max;
      }
      if (min !== undefined && numericVal < min && !isFocused) {
        numericVal = min;
      }

      setDisplayValue(formatNumber(numericVal));
      onChangeValue?.(numericVal);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const suffix = unitSuffix || (formatVnd ? '₫' : undefined);

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn('tabular-nums font-medium', className)}
        trailingIcon={
          suffix ? (
            <span className="text-xs font-semibold text-rentify-text-secondary select-none">
              {suffix}
            </span>
          ) : (
            trailingIcon
          )
        }
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
