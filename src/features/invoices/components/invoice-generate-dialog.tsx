import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';
import { getCurrentMonthPeriod } from '../utils/invoice-period';

export interface InvoiceGenerateDialogProps {
  open: boolean;
  buildings: BuildingMyListItemDto[];
  defaultBuildingId: string;
  defaultPeriod: string;
  isGenerating: boolean;
  onGenerate: (buildingId: string, period: string) => void;
  onClose: () => void;
}

export const InvoiceGenerateDialog = ({
  open,
  buildings,
  defaultBuildingId,
  defaultPeriod,
  isGenerating,
  onGenerate,
  onClose,
}: InvoiceGenerateDialogProps) => {
  const { t } = useTranslation('invoices');
  const [draft, setDraft] = useState<{ buildingId: string; period: string } | null>(null);

  const fallbackBuildingId = defaultBuildingId !== 'all' ? defaultBuildingId : (buildings[0]?.id ?? '');
  const fallbackPeriod = defaultPeriod || getCurrentMonthPeriod();
  const buildingId = draft?.buildingId ?? fallbackBuildingId;
  const period = draft?.period ?? fallbackPeriod;

  const buildingOptions = buildings.map((building) => ({
    value: building.id,
    label: building.name,
  }));

  const isValid = Boolean(buildingId && period);

  const handleClose = () => {
    setDraft(null);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || isGenerating) return;
    onGenerate(buildingId, period);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={t('generate.dialogTitle')}
      description={t('generate.dialogDescription')}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <FormField label={t('filters.buildingLabel')} required htmlFor="generate-invoice-building">
          <SelectDropdown
            id="generate-invoice-building"
            options={buildingOptions}
            value={buildingId}
            onChange={(event) => setDraft({ buildingId: event.target.value, period })}
            leadingIcon={<Building2 className="h-4 w-4 text-rentify-text-secondary" aria-hidden="true" />}
            disabled={isGenerating}
          />
        </FormField>

        <FormField label={t('filters.periodLabel')} required htmlFor="generate-invoice-period">
          <Input
            id="generate-invoice-period"
            type="month"
            value={period}
            onChange={(event) => setDraft({ buildingId, period: event.target.value })}
            disabled={isGenerating}
          />
        </FormField>

        <div className="flex w-full items-center justify-end gap-3 border-t border-rentify-divider pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isGenerating}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isGenerating} disabled={!isValid || isGenerating}>
            {t('actions.generate')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
