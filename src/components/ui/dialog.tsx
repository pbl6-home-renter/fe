import {
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { IconButton } from './icon-button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
  '3xl': 'max-w-6xl',
};

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className,
}: DialogProps) => {
  const { t } = useTranslation('common');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (closeOnOutsideClick && e.target === overlayRef.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 scrim-underlay animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        className={cn(
          'relative w-full bg-rentify-surface rounded-2xl border border-rentify-divider',
          'shadow-[0_16px_40px_-8px_rgba(20,42,76,0.12)] p-6 sm:p-7',
          'flex flex-col gap-4 text-left animate-in zoom-in-95 duration-200 my-auto',
          'max-h-[calc(100vh-3rem)] overflow-y-auto',
          maxWidthMap[maxWidth],
          className
        )}
      >
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={t('closeDialog')}
            onClick={onClose}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </IconButton>
        </div>

        {/* Header */}
        {(title || description) && (
          <div className="flex flex-col gap-1 pr-8">
            {title && (
              <h2 className="text-xl font-bold text-rentify-text-primary tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-rentify-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content Body */}
        {children && <div className="text-sm text-rentify-text-primary py-1">{children}</div>}

        {/* Footer Actions */}
        {footer && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-rentify-divider">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 pr-8', className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end gap-3 pt-3 border-t border-rentify-divider', className)}
    {...props}
  />
);
