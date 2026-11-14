import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Textarea } from '@/components/ui/textarea';
import { useIssueCreateForm } from '../hooks/use-issue-create-form';

interface Props {
  tenant: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export const IssueCreateDialog = ({ tenant, onClose, onCreated }: Props) => {
  const { t } = useTranslation('issues');
  const state = useIssueCreateForm(tenant, onCreated);
  const { form, contracts } = state;
  const categories = ['PLUMBING', 'ELECTRICAL', 'APPLIANCE', 'STRUCTURAL', 'SECURITY', 'OTHER'] as const;
  const urgencies = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'] as const;
  return (
    <Dialog
      open
      onClose={onClose}
      title={t('newTitle')}
      description={t('newDescription')}
      closeOnOutsideClick={!state.isSubmitting}
      closeOnEsc={!state.isSubmitting}
    >
      <form onSubmit={state.onSubmit} className="space-y-4">
        <Controller
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <SelectDropdown
              label={t('room')}
              placeholder={t('roomPlaceholder')}
              value={field.value}
              options={state.options}
              disabled={contracts.isLoading || state.isSubmitting}
              error={form.formState.errors.roomId ? t('required') : undefined}
              onSelectOption={(option) => {
                field.onChange(String(option.value));
                state.setSelectedRoom({ value: String(option.value), label: option.label });
              }}
            />
          )}
        />
        {contracts.isError && (
          <div role="alert">
            <p>{t('roomsError')}</p>
            <Button variant="outline" type="button" onClick={() => void contracts.refetch()}>
              {t('retry')}
            </Button>
          </div>
        )}
        {!contracts.isLoading && !contracts.isError && !contracts.data?.items.length && <p>{t('noRooms')}</p>}
        {contracts.data && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={!contracts.data.pagination.hasPreviousPage}
              onClick={() => state.setPageNo(state.pageNo - 1)}
            >
              {t('previous')}
            </Button>
            <span>{t('page', { page: state.pageNo, total: Math.max(1, contracts.data.pagination.totalPages) })}</span>
            <Button
              variant="outline"
              type="button"
              disabled={!contracts.data.pagination.hasNextPage}
              onClick={() => state.setPageNo(state.pageNo + 1)}
            >
              {t('next')}
            </Button>
          </div>
        )}
        <Input
          label={t('titleField')}
          maxLength={255}
          {...form.register('title')}
          error={form.formState.errors.title ? t('required') : undefined}
        />
        <Textarea label={t('description')} maxLength={500} {...form.register('description')} />
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <SelectDropdown
              label={t('category')}
              value={field.value}
              options={categories.map((value) => ({ value, label: t(`categories.${value}`) }))}
              onSelectOption={(option) => field.onChange(option.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <SelectDropdown
              label={t('urgency')}
              value={field.value}
              options={urgencies.map((value) => ({ value, label: t(`urgencies.${value}`) }))}
              onSelectOption={(option) => field.onChange(option.value)}
            />
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={state.isSubmitting}>
            {t('cancel')}
          </Button>
          <Button type="submit" isLoading={state.isSubmitting}>
            {t('create')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
