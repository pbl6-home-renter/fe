import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, type ButtonVariant } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { getFieldError } from '@/lib/form';
import { MODERATION_LIMITS } from '../../constants/moderation.constants';
import { optionalReasonSchema, reasonSchema, type ReasonFormData } from '../../forms/moderation.schema';

export interface ModerationReasonDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  confirmText: string;
  confirmVariant?: ButtonVariant;
  /** Required reasons block submit while empty (reject appeal, lock account). */
  required?: boolean;
  defaultValue?: string;
  isSubmitting: boolean;
  onSubmit: (reason: string) => void;
}

/** Confirmation dialog with one reason/note textarea, shared by the admin moderation actions. */
export const ModerationReasonDialog = ({
  open,
  onClose,
  title,
  description,
  label,
  placeholder,
  confirmText,
  confirmVariant = 'primary',
  required = false,
  defaultValue = '',
  isSubmitting,
  onSubmit,
}: ModerationReasonDialogProps) => {
  const { t } = useTranslation('moderation');
  const form = useForm<ReasonFormData>({
    resolver: zodResolver(required ? reasonSchema : optionalReasonSchema),
    defaultValues: { reason: defaultValue },
    mode: 'onChange',
  });
  const {
    register,
    reset,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) reset({ reason: defaultValue });
  }, [open, defaultValue, reset]);

  const reason = useWatch({ control, name: 'reason' });
  const isBlank = required && !reason?.trim();
  const handleSubmit = form.handleSubmit((values) => onSubmit(values.reason.trim()));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="md"
      closeOnEsc={!isSubmitting}
      closeOnOutsideClick={!isSubmitting}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button variant={confirmVariant} onClick={handleSubmit} isLoading={isSubmitting} disabled={isBlank}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="py-2">
        <FormField
          label={label}
          required={required}
          htmlFor="moderation-reason"
          error={getFieldError(errors.reason, t)}
        >
          <Textarea
            id="moderation-reason"
            rows={4}
            placeholder={placeholder}
            maxLength={MODERATION_LIMITS.REASON_MAX}
            showCount
            {...register('reason')}
          />
        </FormField>
      </form>
    </Dialog>
  );
};
