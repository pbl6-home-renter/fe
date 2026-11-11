import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
}

/**
 * Card component - Rentify design system card
 * Features: bg-rentify-surface, border divider, rounded-2xl, subtle shadow.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-rentify-surface border border-rentify-divider shadow-card',
      flat: 'bg-rentify-surface border border-rentify-divider',
      interactive:
        'bg-rentify-surface border border-rentify-divider shadow-card hover:shadow-spotlight hover:border-rentify-primary/40 transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none',
    };

    return (
      <div ref={ref} className={cn('rounded-2xl p-5 sm:p-6', variantStyles[variant], className)} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export const CardButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'ui-press w-full cursor-pointer rounded-2xl border border-rentify-divider bg-rentify-surface p-5 text-left shadow-card',
        'transition-[box-shadow,border-color,background-color] duration-200 hover:border-rentify-primary/40 hover:shadow-spotlight motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
CardButton.displayName = 'CardButton';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4 border-b border-rentify-divider', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-rentify-text-primary', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-rentify-text-secondary leading-relaxed', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-4', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-4 border-t border-rentify-divider', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
