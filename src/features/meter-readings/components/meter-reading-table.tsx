import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Droplets, Eye } from 'lucide-react';
import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { ROUTES } from '@/config/routes.config';
import { TextLink } from '@/components/ui/text-link';
import { MeterReadingCellInput } from './meter-reading-cell-input';
import { MeterReadingMobileCard } from './meter-reading-mobile-card';
import { MeterType } from '../enums/meter-type.enum';
import type { CellOcrSuccessData, RoomReadingRowState } from '../types/meter-reading.dto';

interface MeterReadingTableProps {
  rows: RoomReadingRowState[];
  selectedPeriod: string;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onReadingChange: (roomId: string, type: MeterType, val: string) => void;
  onCellOcrSuccess: (roomId: string, type: MeterType, data: CellOcrSuccessData) => void;
  onOpenSingleModal: (row: RoomReadingRowState, type: MeterType) => void;
  onViewImage: (url: string) => void;
}

const DEFAULT_PINNING: ColumnPinningState = { left: [], right: ['actions'] };
const REQUIRED_COLUMNS = ['roomName', 'actions'];

export const MeterReadingTable = ({
  rows,
  isLoading,
  isFetching,
  isError,
  onRetry,
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
    defaultPageSize: 20,
    defaultColumnPinning: DEFAULT_PINNING,
    requiredColumnIds: REQUIRED_COLUMNS,
  });

  const columns = useMemo<ColumnDef<RoomReadingRowState, unknown>[]>(() => {
    const renderMeterCell = (row: RoomReadingRowState, type: MeterType) => {
      const cell = type === MeterType.ELECTRICITY ? row.electricity : row.water;
      return (
        <MeterReadingCellInput
          roomId={row.roomId}
          type={type}
          previousReading={cell.previousReading}
          currentReading={cell.currentReading}
          consumption={cell.consumption}
          evidenceMediaId={cell.evidenceMediaId}
          evidencePreviewUrl={cell.evidencePreviewUrl}
          source={cell.source}
          ocrValue={cell.ocrValue}
          ocrConfidence={cell.ocrConfidence}
          isSaved={cell.isSaved}
          onReadingChange={(val) => onReadingChange(row.roomId, type, val)}
          onOcrSuccess={(data) => onCellOcrSuccess(row.roomId, type, data)}
          onViewImage={onViewImage}
        />
      );
    };

    return [
      {
        accessorKey: 'roomName',
        header: t('columns.room'),
        size: 160,
        minSize: 120,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <TextLink
            to={ROUTES.LANDLORD.ROOM_DETAIL(row.original.roomId)}
            onClick={(e) => e.stopPropagation()}
            className="font-bold"
          >
            {row.original.roomName}
          </TextLink>
        ),
      },
      {
        id: 'electricity',
        header: () => (
          <div className="flex items-center gap-1.5 text-rentify-warning font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('types.electricity')} (kWh)</span>
          </div>
        ),
        size: 380,
        minSize: 300,
        meta: { label: t('types.electricity') },
        cell: ({ row }) => renderMeterCell(row.original, MeterType.ELECTRICITY),
      },
      {
        id: 'water',
        header: () => (
          <div className="flex items-center gap-1.5 text-rentify-primary font-bold">
            <Droplets className="w-3.5 h-3.5" />
            <span>{t('types.water')} (m³)</span>
          </div>
        ),
        size: 380,
        minSize: 300,
        meta: { label: t('types.water') },
        cell: ({ row }) => renderMeterCell(row.original, MeterType.WATER),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('columns.actions')}</div>,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 160,
        minSize: 140,
        meta: {
          label: t('columns.actions'),
          align: 'right',
          pinnable: true,
          hideable: false,
        },
        cell: ({ row }) => {
          const isSaved = row.original.electricity.isSaved || row.original.water.isSaved;
          return (
            <div className="text-right py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSingleModal(row.original, MeterType.ELECTRICITY);
                }}
                className="h-8 gap-1 text-[11px] text-rentify-primary hover:bg-rentify-primary/10 whitespace-nowrap inline-flex"
              >
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>{isSaved ? t('actions.viewDetails') : t('actions.detailEntry')}</span>
              </Button>
            </div>
          );
        },
      },
    ];
  }, [t, onReadingChange, onCellOcrSuccess, onOpenSingleModal, onViewImage]);

  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (row) => row.roomId,
    mode: 'client',
    state,
    handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });

  return (
    <DataTable
      table={table}
      tableId="landlord-meter-readings"
      caption={t('page.title')}
      density={state.density}
      onDensityChange={setDensity}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      emptyState={{ title: t('warnings.noRoomsInBuilding') }}
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
