import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Droplets, SlidersHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { MeterReadingCellInput } from './meter-reading-cell-input';
import { MeterReadingMobileCard } from './meter-reading-mobile-card';
import { MeterType } from '../enums/meter-type.enum';
import type { RoomReadingRowState } from '../types/meter-reading.dto';

interface MeterReadingTableProps {
  rows: RoomReadingRowState[];
  selectedPeriod: string;
  onReadingChange: (roomId: string, type: MeterType, val: string) => void;
  onCellOcrSuccess: (
    roomId: string,
    type: MeterType,
    data: {
      currentReading?: string;
      evidenceMediaId: string;
      previewUrl: string;
      source: 'manual' | 'ocr';
      ocrValue?: string | null;
      ocrConfidence?: number;
    },
  ) => void;
  onOpenSingleModal: (row: RoomReadingRowState, type: MeterType) => void;
  onViewImage: (url: string) => void;
}

export const MeterReadingTable = ({
  rows,
  onReadingChange,
  onCellOcrSuccess,
  onOpenSingleModal,
  onViewImage,
}: MeterReadingTableProps) => {
  const { t } = useTranslation('meterReadings');

  const { state, handlers, setDensity } = useDataTableState({
    tableId: 'landlord-meter-readings',
    columnIds: ['roomName', 'electricity', 'water', 'actions'],
    allowedSorts: ['roomName'],
    defaultPageSize: 100,
  });

  const columns = useMemo<ColumnDef<RoomReadingRowState, unknown>[]>(
    () => [
      {
        accessorKey: 'roomName',
        header: t('columns.room'),
        size: 140,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <div className="font-bold text-rentify-text-primary text-sm py-2">{row.original.roomName}</div>
        ),
      },
      {
        id: 'electricity',
        header: () => (
          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('types.electricity')} (kWh)</span>
          </div>
        ),
        size: 280,
        meta: { label: t('types.electricity') },
        cell: ({ row }) => (
          <MeterReadingCellInput
            roomId={row.original.roomId}
            type={MeterType.ELECTRICITY}
            previousReading={row.original.electricity.previousReading}
            currentReading={row.original.electricity.currentReading}
            consumption={row.original.electricity.consumption}
            evidenceMediaId={row.original.electricity.evidenceMediaId}
            evidencePreviewUrl={row.original.electricity.evidencePreviewUrl}
            source={row.original.electricity.source}
            ocrValue={row.original.electricity.ocrValue}
            ocrConfidence={row.original.electricity.ocrConfidence}
            isSaved={row.original.electricity.isSaved}
            onReadingChange={(val) => onReadingChange(row.original.roomId, MeterType.ELECTRICITY, val)}
            onOcrSuccess={(data) => onCellOcrSuccess(row.original.roomId, MeterType.ELECTRICITY, data)}
            onViewImage={onViewImage}
          />
        ),
      },
      {
        id: 'water',
        header: () => (
          <div className="flex items-center gap-1.5 text-blue-600 font-bold">
            <Droplets className="w-3.5 h-3.5" />
            <span>{t('types.water')} (m³)</span>
          </div>
        ),
        size: 280,
        meta: { label: t('types.water') },
        cell: ({ row }) => (
          <MeterReadingCellInput
            roomId={row.original.roomId}
            type={MeterType.WATER}
            previousReading={row.original.water.previousReading}
            currentReading={row.original.water.currentReading}
            consumption={row.original.water.consumption}
            evidenceMediaId={row.original.water.evidenceMediaId}
            evidencePreviewUrl={row.original.water.evidencePreviewUrl}
            source={row.original.water.source}
            ocrValue={row.original.water.ocrValue}
            ocrConfidence={row.original.water.ocrConfidence}
            isSaved={row.original.water.isSaved}
            onReadingChange={(val) => onReadingChange(row.original.roomId, MeterType.WATER, val)}
            onOcrSuccess={(data) => onCellOcrSuccess(row.original.roomId, MeterType.WATER, data)}
            onViewImage={onViewImage}
          />
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('columns.actions')}</div>,
        size: 110,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <div className="text-right py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenSingleModal(row.original, MeterType.ELECTRICITY)}
              className="h-8 gap-1 text-[11px] text-rentify-text-secondary hover:text-rentify-primary"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('actions.detailEntry')}</span>
            </Button>
          </div>
        ),
      },
    ],
    [t, onReadingChange, onCellOcrSuccess, onOpenSingleModal, onViewImage],
  );

  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (row) => row.roomId,
    mode: 'client',
    state,
    handlers,
    features: {
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  return (
    <DataTable
      table={table}
      tableId="landlord-meter-readings"
      caption={t('page.title')}
      density={state.density}
      onDensityChange={setDensity}
      emptyState={{
        title: t('warnings.noRoomsInBuilding'),
      }}
      renderMobileRow={(row) => (
        <MeterReadingMobileCard
          row={row.original}
          onReadingChange={onReadingChange}
          onCellOcrSuccess={onCellOcrSuccess}
          onOpenSingleModal={onOpenSingleModal}
          onViewImage={onViewImage}
        />
      )}
    />
  );
};
