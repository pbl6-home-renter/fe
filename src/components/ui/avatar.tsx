import { useState, type HTMLAttributes } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy';
}

const sizeMap: Record<AvatarSize, { box: string; text: string; icon: string; dot: string }> = {
  sm: { box: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4', dot: 'w-2 h-2' },
  md: { box: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5', dot: 'w-2.5 h-2.5' },
  lg: { box: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6', dot: 'w-3 h-3' },
  xl: { box: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8', dot: 'w-3.5 h-3.5' },
};

const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = sizeMap[size] || sizeMap.md;
  const initials = getInitials(name);

  const statusColorMap = {
    online: 'bg-rentify-success',
    offline: 'bg-rentify-neutral',
    busy: 'bg-rentify-error',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full select-none',
        sizeConfig.box,
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : initials ? (
        <div className="w-full h-full rounded-full bg-rentify-primary text-white flex items-center justify-center font-bold tracking-tight">
          <span className={sizeConfig.text}>{initials}</span>
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-rentify-primary-container text-rentify-primary flex items-center justify-center">
          <User className={sizeConfig.icon} aria-hidden="true" />
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            sizeConfig.dot,
            statusColorMap[status]
          )}
          aria-label={status}
        />
      )}
    </div>
  );
};
