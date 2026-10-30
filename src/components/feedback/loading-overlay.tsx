import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from './loading-spinner';

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  message?: string;
  isFixed?: boolean;
  blur?: boolean;
  className?: string;
}

/**
 * LoadingOverlay component - blocks interaction with a subtle backdrop blur
 * and renders a centered LoadingSpinner when submitting or mutating data.
 */
export const LoadingOverlay = ({
  visible = true,
  message,
  isFixed = false,
  blur = true,
  className,
  ...props
}: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        isFixed ? 'fixed inset-0 z-50' : 'absolute inset-0 z-20',
        'flex flex-col items-center justify-center p-4 bg-white/70 transition-all duration-200',
        blur && 'backdrop-blur-xs',
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-rentify-divider">
        <LoadingSpinner size="lg" color="primary" />
        {message && (
          <p className="text-sm font-medium text-rentify-text-primary text-center max-w-xs">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

