import { useQuery } from '@tanstack/react-query';
import { contractApi } from '@/features/contracts/api/contract.api';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';

export const useTenantActiveContracts = () => useQuery({
  queryKey: ['contracts', 'me', 'all', { status: ContractStatus.ACTIVE }],
  queryFn: async () => {
    const contracts: MyContractListItemDto[] = [];
    let pageNo = 1;
    let hasNextPage = true;
    while (hasNextPage) {
      const page = await contractApi.getMyContracts({ pageNo, filter: { status: ContractStatus.ACTIVE } });
      contracts.push(...page.items);
      hasNextPage = page.pagination.hasNextPage;
      pageNo += 1;
    }
    return contracts;
  },
});
