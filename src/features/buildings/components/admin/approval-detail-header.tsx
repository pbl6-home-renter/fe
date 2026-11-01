import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingStatusBadge } from '../building-status-badge';
import type { BuildingAdminDetailDto } from '../../types/building.dto';
import { BuildingStatus } from '../../enums/building-status.enum';

interface ApprovalDetailHeaderProps {
  building: BuildingAdminDetailDto;
  isApproving: boolean;
  onApprove: () => void;
  onOpenReject: () => void;
}

export const ApprovalDetailHeader = ({
  building,
  isApproving,
  onApprove,
  onOpenReject,
}: ApprovalDetailHeaderProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  const isPending = building.status === BuildingStatus.PENDING;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => navigate('/admin/buildings')}
        className="inline-flex items-center gap-1.5 text-xs text-rentify-text-secondary hover:text-rentify-primary transition-colors cursor-pointer font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('admin.backToQueue')}</span>
      </button>

      <Card className="p-5 sm:p-6 border-rentify-divider bg-rentify-surface shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-rentify-text-primary truncate">
              {building.name}
            </h1>
            <BuildingStatusBadge status={building.status} variant="pill" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rentify-text-secondary">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{building.address}, {building.ward}, {building.province}</span>
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{building.createdAt ? new Date(building.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
            </span>
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Button
              variant="outline"
              size="md"
              onClick={onOpenReject}
              disabled={isApproving}
              className="gap-2 border-rentify-error text-rentify-error hover:bg-rentify-error/10"
            >
              <XCircle className="w-4 h-4" />
              <span>{t('admin.rejectButton')}</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onApprove}
              isLoading={isApproving}
              disabled={isApproving}
              className="gap-2 bg-rentify-success hover:bg-rentify-success/90"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('admin.approveButton')}</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
