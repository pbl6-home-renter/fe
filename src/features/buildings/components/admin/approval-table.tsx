import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, FileCheck2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingStatusBadge } from '../building-status-badge';
import { formatDate } from '@/lib/utils/format';
import type { BuildingAdminListItemDto } from '../../types/building.dto';

interface ApprovalTableProps {
  buildings: BuildingAdminListItemDto[];
}

export const ApprovalTable = ({ buildings }: ApprovalTableProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  return (
    <Card className="border-rentify-divider bg-rentify-surface shadow-xs rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-rentify-divider text-[11px] font-semibold text-rentify-text-secondary uppercase tracking-wider">
              <th className="py-3 px-5">{t('admin.colBuilding', { defaultValue: 'Bất động sản' })}</th>
              <th className="py-3 px-4">{t('admin.colDocuments', { defaultValue: 'Giấy tờ pháp lý' })}</th>
              <th className="py-3 px-4">{t('admin.colCreatedAt', { defaultValue: 'Ngày nộp hồ sơ' })}</th>
              <th className="py-3 px-4">{t('admin.colStatus', { defaultValue: 'Trạng thái' })}</th>
              <th className="py-3 px-5 text-right">{t('admin.colActions', { defaultValue: 'Thao tác' })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rentify-divider text-xs">
            {buildings.map((building) => (
              <tr
                key={building.id}
                onClick={() => navigate(`/admin/approvals/${building.id}`)}
                className="hover:bg-surface-container-low transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rentify-primary-container text-rentify-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                        {building.name}
                      </h4>
                      <p className="text-[11px] text-rentify-text-secondary truncate max-w-[260px]">
                        {t('admin.roomsCount', {
                          count: building.totalRooms,
                          defaultValue: '{{count}} phòng',
                        })}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-rentify-text-primary text-[11px] font-medium">
                    <FileCheck2 className="w-3.5 h-3.5 text-rentify-primary" />
                    <span>
                      {building.documentsCount}{' '}
                      {t('admin.documentsCountUnit', { defaultValue: 'tài liệu' })}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 text-rentify-text-secondary">
                  {building.createdAt ? formatDate(building.createdAt) : '—'}
                </td>

                <td className="py-4 px-4">
                  <BuildingStatusBadge status={building.status} variant="pill" />
                </td>

                <td className="py-4 px-5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/approvals/${building.id}`);
                    }}
                    className="gap-1.5 text-xs text-rentify-primary hover:bg-rentify-primary hover:text-white transition-all shadow-xs"
                  >
                    <span>{t('admin.reviewAction', { defaultValue: 'Thẩm định' })}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
