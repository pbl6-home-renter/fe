import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIssueEditForm } from '../hooks/use-issue-edit-form';
import type { IssueDetail } from '../types/issue.dto';

export const IssueEditDialog = ({ issue, onClose }: { issue: IssueDetail; onClose: () => void }) => {
  const { t } = useTranslation('issues');
  const state = useIssueEditForm(issue, onClose);
  return (
    <Dialog
      open
      onClose={onClose}
      title={t('edit')}
      closeOnOutsideClick={!state.isSubmitting}
      closeOnEsc={!state.isSubmitting}
    >
      <form onSubmit={state.onSubmit} className="space-y-4">
        <Input label={t('assignedTo')} maxLength={500} {...state.form.register('assignedTo')} />
        <Input
          label={t('repairCost')}
          inputMode="numeric"
          {...state.form.register('repairCost')}
          error={state.form.formState.errors.repairCost ? t('invalidCost') : undefined}
        />
        <Textarea label={t('resolutionNote')} maxLength={500} {...state.form.register('resolutionNote')} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose} disabled={state.isSubmitting}>
            {t('cancel')}
          </Button>
          <Button type="submit" isLoading={state.isSubmitting}>
            {t('save')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
