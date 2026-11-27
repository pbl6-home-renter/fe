import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { getApiErrorCode } from '@/lib/api/errors';
import { getFieldError } from '@/lib/form';
import { cn } from '@/lib/utils/cn';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { MODERATION_LIMITS } from '../constants/moderation.constants';
import { REPORT_CATEGORY_VALUES, type ReportContextType } from '../enums/moderation.enum';
import { reportSubmitSchema, type ReportSubmitFormData } from '../forms/moderation.schema';
import { useSubmitReportMutation } from '../hooks/use-submit-report-mutation';
import { ModerationAttachmentsField, type ModerationAttachment } from './moderation-attachments-field';

export interface UserReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportedUser: { id: string; name: string } | null;
  context?: { type: ReportContextType; id: string } | null;
}

/** "Báo cáo vi phạm" dialog shared by the chat header and the tenant detail page. */
export const UserReportDialog = ({ open, onClose, reportedUser, context }: UserReportDialogProps) => {
  const { t } = useTranslation('moderation');
  const [evidence, setEvidence] = useState<ModerationAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const mutation = useSubmitReportMutation();

  const form = useForm<ReportSubmitFormData>({
    resolver: zodResolver(reportSubmitSchema),
    defaultValues: { description: '' },
    mode: 'onTouched',
  });
  const {
    register,
    reset,
    control,
    formState: { errors },
  } = form;
  const selectedCategory = useWatch({ control, name: 'category' });

  if (!reportedUser) return null;

  // Every way out goes through here, so the next opening starts from an empty form.
  const handleClose = () => {
    reset({ description: '' });
    setEvidence([]);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        reportedUserId: reportedUser.id,
        category: values.category,
        description: values.description,
        ...(evidence.length > 0 ? { evidenceMediaIds: evidence.map((item) => item.id) } : {}),
        ...(context ? { contextType: context.type, contextId: context.id } : {}),
      },
      {
        onSuccess: handleClose,
        onError: (error) => {
          // Nothing to fix in the form: a report about this person is already waiting.
          if (getApiErrorCode(error) === 'REPORT_ALREADY_PENDING') handleClose();
        },
      },
    );
  });

  const isBusy = mutation.isPending || isUploading;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={t('report.title')}
      description={t('report.description', { name: reportedUser.name })}
      maxWidth="lg"
      closeOnEsc={!isBusy}
      closeOnOutsideClick={!isBusy}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            {t('actions.cancel')}
          </Button>
          <Button variant="danger" onClick={handleSubmit} isLoading={mutation.isPending} disabled={isUploading}>
            {t('report.submit')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium text-rentify-text-primary">
            {t('report.categoryLabel')} <span className="text-rentify-error">*</span>
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REPORT_CATEGORY_VALUES.map((category) => (
              <label
                key={category}
                className={cn(
                  'flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors',
                  selectedCategory === category
                    ? 'border-rentify-primary bg-rentify-primary-container/30 font-medium text-rentify-primary'
                    : 'border-rentify-divider hover:border-rentify-outline/50',
                )}
              >
                <input
                  type="radio"
                  value={category}
                  className="h-4 w-4 accent-rentify-primary"
                  {...register('category')}
                />
                <span>{t(`categories.${category}.label`)}</span>
              </label>
            ))}
          </div>
          {errors.category && (
            <p role="alert" className="text-xs font-medium text-rentify-error">
              {t('validations.categoryRequired')}
            </p>
          )}
        </fieldset>

        <FormField
          label={t('report.descriptionLabel')}
          required
          htmlFor="user-report-description"
          error={getFieldError(errors.description, t)}
        >
          <Textarea
            id="user-report-description"
            rows={4}
            placeholder={t('report.descriptionPlaceholder')}
            maxLength={MODERATION_LIMITS.REPORT_DESCRIPTION_MAX}
            showCount
            {...register('description')}
          />
        </FormField>

        <ModerationAttachmentsField
          purpose={MediaPurpose.REPORT_EVIDENCE}
          label={t('report.evidenceLabel')}
          helperText={t('report.evidenceHelper')}
          value={evidence}
          onChange={setEvidence}
          onUploadingChange={setIsUploading}
          disabled={mutation.isPending}
        />
      </form>
    </Dialog>
  );
};
