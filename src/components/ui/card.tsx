import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
}

/**
 * Card component - Rentify design system card
 * Features: bg-rentify-surface, border divider, rounded-xl, subtle shadow.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-[var(--color-rentify-surface,#FFFFFF)] border border-[var(--color-rentify-divider,#D7E3F2)] shadow-[0_4px_20px_-4px_rgba(30,111,217,0.06)]',
      flat:
        'bg-[var(--color-rentify-surface,#FFFFFF)] border border-[var(--color-rentify-divider,#D7E3F2)]',
      interactive:
        'bg-[var(--color-rentify-surface,#FFFFFF)] border border-[var(--color-rentify-divider,#D7E3F2)] shadow-[0_4px_20px_-4px_rgba(30,111,217,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(30,111,217,0.12)] hover:border-[var(--color-rentify-primary,#1E6FD9)]/40 transition-all duration-200 cursor-pointer',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-xl p-5 sm:p-6', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4 border-b border-[var(--color-rentify-divider,#D7E3F2)]', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-[var(--color-rentify-text-primary,#142A4C)]', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-rentify-text-secondary,#5C7290)] leading-relaxed', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-[var(--color-rentify-divider,#D7E3F2)]', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;

