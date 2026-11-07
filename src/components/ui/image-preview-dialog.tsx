import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, type DialogProps } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface ImagePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title?: ReactNode;
  alt?: string;
  emptyText?: ReactNode;
  closeText?: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  className?: string;
  imageClassName?: string;
}

export const ImagePreviewDialog = ({
  open,
  onClose,
  imageUrl,
  title,
  alt,
  emptyText,
  closeText,
  maxWidth = 'md',
  className,
  imageClassName,
}: ImagePreviewDialogProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      className={className}
      footer={
        <div className="flex justify-end w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {closeText || t('closeDialog')}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt || (typeof title === 'string' ? title : 'Preview')}
            className={cn(
              'max-h-[65vh] max-w-full rounded-xl object-contain border border-rentify-divider shadow-xs',
              imageClassName,
            )}
          />
        ) : (
          <p className="text-xs text-rentify-text-secondary py-8">{emptyText || t('emptyData')}</p>
        )}
      </div>
    </Dialog>
  );
};
