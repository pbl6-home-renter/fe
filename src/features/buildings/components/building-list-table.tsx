import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BuildingStatusBadge } from './building-status-badge';
import type { BuildingMyListItemDto } from '../types/building.dto';

interface BuildingListTableProps {
  buildings: BuildingMyListItemDto[];
}

export const BuildingListTable = ({ buildings }: BuildingListTableProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  return (
    <div className="bg-rentify-surface border border-rentify-divider rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-rentify-divider text-rentify-text-secondary text-xs font-semibold">
              <th className="py-3.5 px-5" scope="col">{t('columns.name')}</th>
              <th className="py-3.5 px-4" scope="col">{t('columns.address')}</th>
              <th className="py-3.5 px-4" scope="col">{t('list.approvalStatus')}</th>
              <th className="py-3.5 px-4" scope="col">{t('columns.rooms')}</th>
              <th className="py-3.5 px-4 min-w-[130px]" scope="col">{t('list.occupancyRate')}</th>
              <th className="py-3.5 px-5 text-right" scope="col">{t('admin.colActions', { defaultValue: 'Thao tác' })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rentify-divider">
            {buildings.map((building) => {
              const occRate = Number(building.occupancyRate) || 0;
              return (
                <tr
                  key={building.id}
                  onClick={() => navigate(`/buildings/${building.id}`)}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rentify-primary-container text-rentify-primary flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                          {building.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-start gap-1.5 text-xs text-rentify-text-primary">
                      <MapPin className="w-3.5 h-3.5 text-rentify-text-secondary shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{building.address || '—'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <BuildingStatusBadge status={building.status} />
                  </td>

                  {/* Rooms */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-rentify-text-primary">
                        {t('list.rooms', { count: building.totalRooms ?? 0 })}
                      </span>
                      <span className="text-xs text-rentify-text-secondary">
                        {t('list.occupiedRoomsCount', { count: building.occupiedRooms ?? 0 })}
                      </span>
                    </div>
                  </td>

                  {/* Occupancy rate */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-rentify-text-secondary">{t('list.occupancy')}</span>
                        <span className="font-bold text-rentify-text-primary">{building.occupancyRate}%</span>
                      </div>
                      <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rentify-success h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, occRate)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/buildings/${building.id}`);
                      }}
                      className="gap-1.5 text-xs text-rentify-primary hover:text-rentify-primary"
                    >
                      <span>{t('viewDetail')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
