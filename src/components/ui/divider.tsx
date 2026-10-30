import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

export const Divider = ({
  orientation = 'horizontal',
  children,
  className,
  ...props
}: DividerProps) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block w-px self-stretch bg-rentify-divider', className)}
        {...props}
      />
    );
  }

  if (children) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center w-full my-4 text-xs text-rentify-text-secondary select-none', className)}
        {...props}
      >
        <div className="flex-1 h-px bg-rentify-divider" />
        <span className="px-3 font-medium">{children}</span>
        <div className="flex-1 h-px bg-rentify-divider" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full border-t border-rentify-divider my-4', className)}
      {...props}
    />
  );
};
