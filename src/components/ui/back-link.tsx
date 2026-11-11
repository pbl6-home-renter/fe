import { ArrowLeft } from 'lucide-react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

export const BackLink = ({ children, className, ...props }: LinkProps) => (
  <Link
    className={cn(
      'ui-press inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-sm font-medium text-rentify-text-secondary',
      'transition-colors hover:bg-rentify-primary-container/50 hover:text-rentify-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  >
    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </Link>
);
