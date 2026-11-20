import { Skeleton } from '@/components/feedback/skeleton';

export const ComposerSkeleton = () => (
  <div
    className="flex shrink-0 items-center gap-2 border-t border-rentify-divider bg-rentify-surface p-3"
    aria-hidden="true"
  >
    <Skeleton variant="circular" className="h-10 w-10" />
    <Skeleton className="h-11 flex-1 rounded-full" />
    <Skeleton variant="circular" className="h-10 w-10" />
  </div>
);
