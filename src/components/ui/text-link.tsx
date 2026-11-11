import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

export const TextLink = ({ className, ...props }: LinkProps) => (
  <Link
    className={cn(
      'inline-flex min-h-10 items-center rounded-lg px-1 text-sm font-semibold text-rentify-primary',
      'transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary',
      className,
    )}
    {...props}
  />
);
