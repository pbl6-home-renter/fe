import { roomApi } from '@/features/rooms/api/room.api';
import { contractApi } from '@/features/contracts/api/contract.api';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';

/**
 * Collects all active resident user IDs across all active contracts in a building.
 * Ensures strict isolation by only including contracts that belong to this building's rooms.
 */
export const fetchBuildingActiveTenantIds = async (buildingId: string): Promise<string[]> => {
  try {
    const roomsRes = await roomApi.getMyRooms({
      filter: { buildingId },
      pageSize: 100,
    });
    const buildingRooms = (roomsRes.items || []).filter((r) => r.buildingId === buildingId);
    if (buildingRooms.length === 0) return [];

    const buildingRoomIds = new Set(buildingRooms.map((r) => r.id));

    const contractsRes = await contractApi.getContracts({ pageSize: 100 });
    const contracts = (contractsRes.items || []).filter(
      (c) => c.status === ContractStatus.ACTIVE && buildingRoomIds.has(c.roomId),
    );
    if (contracts.length === 0) return [];

    const membersResults = await Promise.all(
      contracts.map((c) =>
        contractApi.getContractMembers(c.id, { pageNo: 1, pageSize: 50 }).catch(() => ({ items: [] })),
      ),
    );

    const tenantIds = new Set<string>();
    for (const res of membersResults) {
      for (const m of res.items || []) {
        if (m.status === 'active' && m.tenantId) {
          tenantIds.add(m.tenantId);
        }
      }
    }
    return Array.from(tenantIds);
  } catch {
    return [];
  }
};
