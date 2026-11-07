import { useTranslation } from 'react-i18next';
import { Building2, Calendar, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { getNextPeriod, getPreviousPeriod } from '../utils/meter-reading.helper';
import { formatMonth } from '@/lib/utils/format';
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
    <div className="bg-rentify-surface border border-rentify-divider rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs">
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            aria-label={t('filter.previousMonth')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4 text-rentify-text-secondary" />
          </Button>

          <div className="flex items-center gap-1.5 px-2 min-w-28 justify-center">
            <Calendar className="w-3.5 h-3.5 text-rentify-primary" />
            <span className="text-xs font-semibold text-rentify-text-primary">
              {formatMonth(selectedPeriod) || selectedPeriod}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            aria-label={t('filter.nextMonth')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4 text-rentify-text-secondary" />
          </Button>
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
    </div>
  );
};
