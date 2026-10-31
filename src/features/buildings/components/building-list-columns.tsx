import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingMyListItemDto } from '../types/building.dto';

export const useBuildingListColumns = () => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  return useMemo<ColumnDef<BuildingMyListItemDto, unknown>[]>(() => [
    {
      accessorKey: 'name',
      header: t('columns.name'),
      size: 240,
      minSize: 180,
      meta: { label: t('columns.name'), pinnable: true },
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="truncate font-semibold group-hover:text-rentify-primary">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: t('columns.address'),
      enableSorting: false,
      size: 280,
      minSize: 180,
      meta: { label: t('columns.address') },
      cell: ({ row }) => (
        <div className="flex items-start gap-1.5 text-xs">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rentify-text-secondary" />
          <span className="line-clamp-2">{row.original.address || '—'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('list.approvalStatus'),
      size: 160,
      meta: { label: t('list.approvalStatus') },
      cell: ({ row }) => <BuildingStatusBadge status={row.original.status} />,
    },
    {
      id: 'rooms',
      header: t('columns.rooms'),
      enableSorting: false,
      size: 150,
      meta: { label: t('columns.rooms'), align: 'right' },
      cell: ({ row }) => (
        <div className="flex flex-col text-right">
          <span className="font-semibold tabular-nums">{t('list.rooms', { count: row.original.totalRooms ?? 0 })}</span>
          <span className="text-xs text-rentify-text-secondary">
            {t('list.occupiedRoomsCount', { count: row.original.occupiedRooms ?? 0 })}
          </span>
        </div>
      ),
    },
    {
      id: 'occupancy',
      header: t('list.occupancyRate'),
      enableSorting: false,
      size: 170,
      minSize: 140,
      meta: { label: t('list.occupancyRate'), align: 'right' },
      cell: ({ row }) => {
        const value = Math.min(100, Math.max(0, Number(row.original.occupancyRate) || 0));
        return (
          <div className="ml-auto flex max-w-36 flex-col gap-1.5">
            <span className="text-right text-xs font-bold tabular-nums">{row.original.occupancyRate}%</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-low">
              <div className="h-full rounded-full bg-rentify-success" style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: t('admin.colActions'),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 130,
      meta: { label: t('admin.colActions'), align: 'right', pinnable: true, hideable: false },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5 text-rentify-primary"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/buildings/${row.original.id}`);
          }}
        >
          {t('viewDetail')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ], [navigate, t]);
};

