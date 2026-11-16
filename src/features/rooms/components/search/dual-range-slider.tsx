import { useId } from 'react';
import { formatVnd } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  className?: string;
  minLabel?: string;
  maxLabel?: string;
}

export const DualRangeSlider = ({
  min,
  max,
  step = 500_000,
  minValue,
  maxValue,
  onChange,
  className,
  minLabel,
  maxLabel,
}: DualRangeSliderProps) => {
  const minInputId = useId();
  const maxInputId = useId();

  const minPercent = Math.min(100, Math.max(0, ((minValue - min) / (max - min)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((maxValue - min) / (max - min)) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = Math.min(Number(e.target.value), maxValue - step);
    onChange(nextVal, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = Math.max(Number(e.target.value), minValue + step);
    onChange(minValue, nextVal);
  };

  return (
    <div className={cn('space-y-4 pt-1', className)}>
      {/* Values Display */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-rentify-text-secondary font-medium">{minLabel}</span>
          <span className="text-sm font-bold text-rentify-text-primary tabular-nums">{formatVnd(minValue)}</span>
        </div>
        <span className="text-rentify-text-muted font-bold">—</span>
        <div className="flex flex-col text-right">
          <span className="text-[11px] text-rentify-text-secondary font-medium">{maxLabel}</span>
          <span className="text-sm font-bold text-rentify-text-primary tabular-nums">{formatVnd(maxValue)}</span>
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative h-6 flex items-center select-none">
        {/* Inactive Track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-rentify-divider" />

        {/* Active Range Highlight */}
        <div
          className="absolute h-2 rounded-full bg-rentify-primary transition-all duration-75"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Input Slider */}
        <input
          id={minInputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          aria-label={minLabel}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-rentify-primary [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-rentify-primary [&::-moz-range-thumb]:ring-4 [&::-moz-range-thumb]:ring-white [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max Input Slider */}
        <input
          id={maxInputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          aria-label={maxLabel}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 z-20 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-rentify-primary [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-rentify-primary [&::-moz-range-thumb]:ring-4 [&::-moz-range-thumb]:ring-white [&::-moz-range-thumb]:shadow-md"
        />

        {/* Visual Knobs */}
        <div
          className="absolute h-5 w-5 -ml-2.5 rounded-full bg-rentify-primary border-2 border-white shadow-md pointer-events-none z-10"
          style={{ left: `${minPercent}%` }}
        />
        <div
          className="absolute h-5 w-5 -ml-2.5 rounded-full bg-rentify-primary border-2 border-white shadow-md pointer-events-none z-10"
          style={{ left: `${maxPercent}%` }}
        />
      </div>
    </div>
  );
};
