import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getFieldError } from '@/lib/form';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { MODERATION_LIMITS } from '../constants/moderation.constants';
import { appealSubmitSchema, type AppealSubmitFormData } from '../forms/moderation.schema';
import { useSubmitAppealMutation } from '../hooks/use-submit-appeal-mutation';
import { ModerationAttachmentsField, type ModerationAttachment } from './moderation-attachments-field';

export const AppealForm = ({ lockReason }: { lockReason: string | null }) => {
  const { t } = useTranslation('moderation');
  const [attachments, setAttachments] = useState<ModerationAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const mutation = useSubmitAppealMutation();

  const form = useForm<AppealSubmitFormData>({
    resolver: zodResolver(appealSubmitSchema),
    defaultValues: { content: '', contactEmail: '', contactPhone: '' },
    mode: 'onTouched',
  });
  const {
    register,
    formState: { errors },
  } = form;

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      content: values.content,
      ...(attachments.length > 0 ? { attachmentMediaIds: attachments.map((item) => item.id) } : {}),
      ...(values.contactEmail ? { contactEmail: values.contactEmail } : {}),
      ...(values.contactPhone ? { contactPhone: values.contactPhone } : {}),
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label={t('appealForm.lockReasonLabel')} htmlFor="appeal-lock-reason">
        <Textarea id="appeal-lock-reason" rows={2} value={lockReason ?? t('locked.noReason')} readOnly disabled />
      </FormField>

      <FormField
        label={t('appealForm.contentLabel')}
        required
        htmlFor="appeal-content"
        error={getFieldError(errors.content, t)}
        helperText={t('appealForm.contentHelper')}
      >
        <Textarea
          id="appeal-content"
          rows={6}
          placeholder={t('appealForm.contentPlaceholder')}
          maxLength={MODERATION_LIMITS.APPEAL_CONTENT_MAX}
          showCount
          {...register('content')}
        />
      </FormField>

      <ModerationAttachmentsField
        purpose={MediaPurpose.APPEAL_ATTACHMENT}
        label={t('appealForm.attachmentsLabel')}
        helperText={t('appealForm.attachmentsHelper')}
        value={attachments}
        onChange={setAttachments}
        onUploadingChange={setIsUploading}
        disabled={mutation.isPending}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="appeal-contact-email"
          type="email"
          label={t('appealForm.contactEmailLabel')}
          placeholder={t('appealForm.contactEmailPlaceholder')}
          error={getFieldError(errors.contactEmail, t)}
          {...register('contactEmail')}
        />
        <Input
          id="appeal-contact-phone"
          type="tel"
          label={t('appealForm.contactPhoneLabel')}
          placeholder={t('appealForm.contactPhonePlaceholder')}
          error={getFieldError(errors.contactPhone, t)}
          {...register('contactPhone')}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={mutation.isPending} disabled={isUploading} className="gap-1.5">
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>{t('appealForm.submit')}</span>
        </Button>
      </div>
    </form>
  );
};
