import { ROUTES } from '@/config/routes.config';
import { InvoiceBlockReason } from '../enums/invoice-status.enum';
import type { InvoiceBlockedItemDto } from '../types/invoices.dto';

export interface InvoiceBlockContext {
  buildingId: string;
  period: string;
}

export const getInvoiceBlockFixTarget = (
  item: InvoiceBlockedItemDto,
  context: InvoiceBlockContext,
): { to: string; actionKey: string } | null => {
  switch (item.reasonCode) {
    case InvoiceBlockReason.READING_MISSING: {
      const search = new URLSearchParams({
        buildingId: context.buildingId,
        period: context.period,
      });
      return {
        to: `${ROUTES.LANDLORD.METER_READINGS}?${search.toString()}`,
        actionKey: 'generate.blockActions.enterReadings',
      };
    }
    case InvoiceBlockReason.RATE_MISSING:
    case InvoiceBlockReason.TIER_CONFIG_INVALID:
      return {
        to: ROUTES.LANDLORD.BUILDING_DETAIL(context.buildingId),
        actionKey: 'generate.blockActions.configureRates',
      };
    case InvoiceBlockReason.AREA_MISSING:
      return {
        to: ROUTES.LANDLORD.ROOM_DETAIL(item.roomId),
        actionKey: 'generate.blockActions.updateRoomArea',
      };
    case InvoiceBlockReason.HEADCOUNT_ZERO:
      return {
        to: `${ROUTES.LANDLORD.CONTRACT_DETAIL(item.contractId)}?tab=members`,
        actionKey: 'generate.blockActions.addContractMembers',
      };
    case InvoiceBlockReason.VEHICLE_COUNT_MISSING:
      return {
        to: `${ROUTES.LANDLORD.CONTRACT_DETAIL(item.contractId)}?edit=vehicle`,
        actionKey: 'generate.blockActions.updateVehicleCount',
      };
    case InvoiceBlockReason.TOTAL_NEGATIVE:
    default:
      return null;
  }
};
