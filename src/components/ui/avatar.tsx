import { useState, type HTMLAttributes } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy';
  /** Picks a stable background colour for the initials (e.g. a user id) instead of the brand colour. */
  colorSeed?: string;
}

const SEEDED_COLORS = [
  'bg-[#1e6fd9]',
  'bg-[#0f9d8a]',
  'bg-[#7c4dcc]',
  'bg-[#d9534f]',
  'bg-[#e08a1e]',
  'bg-[#2f855a]',
  'bg-[#c2417f]',
  'bg-[#3d5a98]',
];

const seededColor = (seed: string): string => {
  let hash = 0;
  for (const character of seed) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return SEEDED_COLORS[Math.abs(hash) % SEEDED_COLORS.length];
};

const sizeMap: Record<AvatarSize, { box: string; text: string; icon: string; dot: string }> = {
  '2xs': { box: 'w-4 h-4', text: 'text-[7px]', icon: 'w-2.5 h-2.5', dot: 'w-1.5 h-1.5' },
  xs: { box: 'w-7 h-7', text: 'text-[10px]', icon: 'w-3.5 h-3.5', dot: 'w-2 h-2' },
  sm: { box: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4', dot: 'w-2 h-2' },
  md: { box: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5', dot: 'w-2.5 h-2.5' },
  lg: { box: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6', dot: 'w-3 h-3' },
  xl: { box: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8', dot: 'w-3.5 h-3.5' },
  '2xl': {
    box: 'w-36 h-36 sm:w-44 sm:h-44',
    text: 'text-4xl sm:text-5xl',
    icon: 'w-14 h-14 sm:w-16 sm:h-16',
    dot: 'w-4 h-4',
  },
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
  colorSeed,
  className,
  ...props
}: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageError = Boolean(src) && failedSrc === src;
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
        className,
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src ?? null)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : initials ? (
        <div
          className={cn(
            'w-full h-full rounded-full text-white flex items-center justify-center font-bold tracking-tight',
            colorSeed ? seededColor(colorSeed) : 'bg-rentify-primary',
          )}
        >
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
            statusColorMap[status],
          )}
          aria-label={status}
        />
      )}
    </div>
  );
};
