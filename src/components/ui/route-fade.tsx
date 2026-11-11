import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { MOTION_DURATION } from '@/lib/motion';

interface RouteFadeProps {
  pathname: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const RouteFade = ({ pathname, disabled = false, className, children }: RouteFadeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animation = containerRef.current?.animate([{ opacity: 0.96 }, { opacity: 1 }], {
      duration: MOTION_DURATION.page * 1000,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    return () => animation?.cancel();
  }, [pathname, disabled]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
