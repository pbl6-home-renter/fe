import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * EmptyState component - corresponds to mobile view_empty_state
 * Renders an icon, title, description, and an optional action button.
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 w-full',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-[var(--color-rentify-primary-container,#E8F1FC)] text-[var(--color-rentify-primary,#1E6FD9)] flex items-center justify-center mb-4 transition-transform hover:scale-105">
        <Icon className="w-8 h-8" aria-hidden="true" strokeWidth={1.8} />
      </div>

      <h3 className="text-lg font-semibold text-[var(--color-rentify-text-primary,#142A4C)] mb-1.5 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-[var(--color-rentify-text-secondary,#5C7290)] max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}

      {children}
    </div>
  );
};

export default EmptyState;

