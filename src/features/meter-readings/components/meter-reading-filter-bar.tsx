import { useTranslation } from 'react-i18next';
import { Building2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { getNextPeriod, getPreviousPeriod } from '../utils/meter-reading.helper';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';

interface MeterReadingFilterBarProps {
  buildings: BuildingMyListItemDto[];
  selectedBuildingId: string;
  selectedPeriod: string;
  onBuildingChange: (buildingId: string) => void;
  onPeriodChange: (period: string) => void;
  onSaveBulk: () => void;
  isSaving: boolean;
}

export const MeterReadingFilterBar = ({
  buildings,
  selectedBuildingId,
  selectedPeriod,
  onBuildingChange,
  onPeriodChange,
  onSaveBulk,
  isSaving,
}: MeterReadingFilterBarProps) => {
  const { t } = useTranslation('meterReadings');

  const buildingOptions = buildings.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const handlePrevMonth = () => {
    onPeriodChange(getPreviousPeriod(selectedPeriod));
  };

  const handleNextMonth = () => {
    onPeriodChange(getNextPeriod(selectedPeriod));
  };

  return (
    <Card className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
        {/* Building Selector */}
        <div className="w-full sm:w-64 min-w-0">
          <SelectDropdown
            options={buildingOptions}
            value={selectedBuildingId}
            onChange={(e) => onBuildingChange(e.target.value)}
            placeholder={t('filter.selectBuilding')}
            leadingIcon={<Building2 className="w-4 h-4 text-rentify-text-secondary" />}
          />
        </div>

        {/* Period (Month) Navigator */}
        <div className="flex items-center gap-1.5 bg-rentify-background border border-rentify-divider rounded-xl px-2 py-1">
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            aria-label={t('filter.previousMonth')}
          >
            <ChevronLeft className="w-4 h-4 text-rentify-text-secondary" />
          </IconButton>

          <Input
            type="month"
            value={selectedPeriod}
            onChange={(e) => {
              if (e.target.value) onPeriodChange(e.target.value);
            }}
            aria-label={t('filter.selectMonth')}
            containerClassName="w-36"
            className="min-h-10 border-0 bg-transparent px-1.5 text-xs font-semibold"
          />

          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            aria-label={t('filter.nextMonth')}
          >
            <ChevronRight className="w-4 h-4 text-rentify-text-secondary" />
          </IconButton>
        </div>
      </div>

      {/* Action: Bulk Save */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="primary"
          onClick={onSaveBulk}
          isLoading={isSaving}
          className="w-full sm:w-auto gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{t('actions.saveAll')}</span>
        </Button>
      </div>
    </Card>
  );
};
