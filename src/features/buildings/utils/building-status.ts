import { BuildingStatus } from '../enums/building-status.enum';

export interface BuildingStatusConfig {
  dotClass: string;
  pillClass: string;
  labelKey: 'status.approved' | 'status.rejected' | 'status.pending';
}

export const BUILDING_STATUS_CONFIGS: Record<BuildingStatus, BuildingStatusConfig> = {
  [BuildingStatus.APPROVED]: {
    dotClass: 'bg-rentify-success',
    pillClass: 'bg-rentify-success/10 text-rentify-success border-rentify-success/30',
    labelKey: 'status.approved',
  },
  [BuildingStatus.REJECTED]: {
    dotClass: 'bg-rentify-error',
    pillClass: 'bg-rentify-error/10 text-rentify-error border-rentify-error/30',
    labelKey: 'status.rejected',
  },
  [BuildingStatus.PENDING]: {
    dotClass: 'bg-rentify-neutral',
    pillClass: 'bg-surface-container-low text-rentify-text-secondary border-rentify-divider',
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
