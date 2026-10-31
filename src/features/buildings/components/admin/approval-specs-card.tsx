import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import type { BuildingAdminDetailDto } from '../../types/building.dto';

interface ApprovalSpecsCardProps {
  building: BuildingAdminDetailDto;
}

export const ApprovalSpecsCard = ({ building }: ApprovalSpecsCardProps) => {
  const { t } = useTranslation('buildings');

  return (
    <Card className="p-6 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-4">
      <div className="pb-3 border-b border-rentify-divider">
        <h3 className="text-base font-bold text-rentify-text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4 text-rentify-primary" />
          <span>{t('admin.buildingInfoTitle', { defaultValue: 'Thông tin cơ bản bất động sản' })}</span>
        </h3>
        <p className="text-xs text-rentify-text-secondary mt-0.5">
          {t('admin.buildingInfoDesc', { defaultValue: 'Thông số kỹ thuật và vận hành được khai báo' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-surface-container-low/60 space-y-1">
          <span className="text-rentify-text-secondary">{t('admin.fieldName', { defaultValue: 'Tên tòa nhà' })}</span>
          <p className="font-semibold text-sm text-rentify-text-primary">{building.name}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low/60 space-y-1">
          <span className="text-rentify-text-secondary">{t('admin.fieldScale', { defaultValue: 'Quy mô số tầng' })}</span>
          <p className="font-semibold text-sm text-rentify-text-primary">
            {building.totalFloors ? `${building.totalFloors} tầng` : '—'}
          </p>
        </div>

        <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low/60 space-y-1">
          <span className="text-rentify-text-secondary">{t('admin.fieldAddress', { defaultValue: 'Địa chỉ thực tế' })}</span>
          <p className="font-semibold text-sm text-rentify-text-primary">
            {building.address}, {building.ward}, {building.province}
          </p>
        </div>

        {building.description && (
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low/60 space-y-1">
            <span className="text-rentify-text-secondary">{t('admin.fieldDescription', { defaultValue: 'Mô tả chi tiết' })}</span>
            <p className="text-rentify-text-primary leading-relaxed whitespace-pre-line">
              {building.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
