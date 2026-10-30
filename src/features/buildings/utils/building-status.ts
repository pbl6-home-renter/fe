import { BuildingStatus } from '../enums/building-status.enum';

export interface BuildingStatusConfig {
  dotClass: string;
  pillClass: string;
  labelKey: 'status.approved' | 'status.rejected' | 'status.pending';
}

export const BUILDING_STATUS_CONFIGS: Record<BuildingStatus, BuildingStatusConfig> = {
  [BuildingStatus.APPROVED]: {
    dotClass: 'bg-rentify-success',
    pillClass: 'bg-green-50 text-rentify-success border-green-200',
    labelKey: 'status.approved',
  },
  [BuildingStatus.REJECTED]: {
    dotClass: 'bg-rentify-error',
    pillClass: 'bg-red-50 text-rentify-error border-red-200',
    labelKey: 'status.rejected',
  },
  [BuildingStatus.PENDING]: {
    dotClass: 'bg-rentify-neutral',
    pillClass: 'bg-slate-50 text-slate-600 border-slate-200',
    labelKey: 'status.pending',
  },
};

export const getBuildingStatusConfig = (
  status?: BuildingStatus | string
): BuildingStatusConfig => {
  return (
    (status && BUILDING_STATUS_CONFIGS[status as BuildingStatus]) ||
    BUILDING_STATUS_CONFIGS[BuildingStatus.PENDING]
  );
};
