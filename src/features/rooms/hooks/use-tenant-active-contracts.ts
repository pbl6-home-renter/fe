import { useQuery } from '@tanstack/react-query';
import { contractApi } from '@/features/contracts/api/contract.api';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import { CONTRACT_QUERY_KEYS } from '@/features/contracts/constants/contract.constants';
import type { MyContractListItemDto } from '@/features/contracts/types/contract.dto';
import type { QueryHookOptions } from '@/lib/query/types';

export const useTenantActiveContracts = (options?: QueryHookOptions<MyContractListItemDto[]>) =>
  useQuery({
    queryKey: CONTRACT_QUERY_KEYS.MY_LIST({ filter: { status: ContractStatus.ACTIVE } }),
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
    ...options,
  });
