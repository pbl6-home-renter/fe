import { useEffect, useId, useRef, type ReactNode, type HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MOTION_DURATION, MOTION_EASE, MOTION_EXIT_EASE } from '@/lib/motion';
import { IconButton } from './icon-button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  accessibleTitle?: string;
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
  accessibleTitle,
  description,
  children,
  footer,
  maxWidth = 'md',
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className,
}: DialogProps) => {
  const { t } = useTranslation('common');
  const descriptionId = useId();
  const previousFocus = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const canDismiss = closeOnOutsideClick || closeOnEsc;

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      if (contentRef.current && !contentRef.current.contains(document.activeElement)) {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        closeButtonRef.current?.focus();
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && canDismiss) onClose();
      }}
    >
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <m.div
                className="fixed inset-0 z-50 scrim-underlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: MOTION_DURATION.dialogEnter, ease: MOTION_EASE } }}
                exit={{
                  opacity: 0,
                  pointerEvents: 'none',
                  transition: { duration: MOTION_DURATION.dialogExit, ease: MOTION_EXIT_EASE },
                }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              forceMount
              asChild
              aria-describedby={description ? descriptionId : undefined}
              onOpenAutoFocus={() => {
                previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (previousFocus.current?.isConnected) previousFocus.current.focus();
              }}
              onEscapeKeyDown={(event) => {
                if (!closeOnEsc) event.preventDefault();
              }}
              onInteractOutside={(event) => {
                if (!closeOnOutsideClick) event.preventDefault();
              }}
            >
              <m.div
                ref={contentRef}
                initial={{ opacity: 0, y: 8, scale: 0.985 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: MOTION_DURATION.dialogEnter, ease: MOTION_EASE },
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                  scale: 0.985,
                  pointerEvents: 'none',
                  transition: { duration: MOTION_DURATION.dialogExit, ease: MOTION_EXIT_EASE },
                }}
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2',
                  'max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-rentify-divider bg-rentify-surface',
                  'shadow-modal p-6 sm:p-7 flex flex-col gap-4 text-left focus:outline-none',
                  maxWidthMap[maxWidth],
                  className,
                )}
              >
                <div className="absolute right-4 top-4">
                  <DialogPrimitive.Close asChild>
                    <IconButton
                      ref={closeButtonRef}
                      variant="ghost"
                      size="md"
                      aria-label={t('closeDialog')}
                      disabled={!canDismiss}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </DialogPrimitive.Close>
                </div>

                {(title || description) && (
                  <div className="flex flex-col gap-1 pr-8">
                    {title && (
                      <DialogPrimitive.Title asChild>
                        <div
                          role="heading"
                          aria-level={2}
                          className="text-xl font-bold tracking-tight text-rentify-text-primary"
                        >
                          {title}
                        </div>
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description
                        id={descriptionId}
                        className="text-sm leading-relaxed text-rentify-text-secondary"
                      >
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                )}
                {!title && (
                  <DialogPrimitive.Title className="sr-only">
                    {accessibleTitle || t('dialogTitle')}
                  </DialogPrimitive.Title>
                )}

                {children && <div className="py-1 text-sm text-rentify-text-primary">{children}</div>}
                {footer && (
                  <div className="flex items-center justify-end gap-3 border-t border-rentify-divider pt-3">
                    {footer}
                  </div>
                )}
              </m.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 pr-8', className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end gap-3 border-t border-rentify-divider pt-3', className)}
    {...props}
  />
);
