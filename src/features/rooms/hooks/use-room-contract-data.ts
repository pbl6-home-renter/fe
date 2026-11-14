import { useQuery } from '@tanstack/react-query';
import { contractApi } from '@/features/contracts/api/contract.api';
import { CONTRACT_QUERY_KEYS } from '@/features/contracts/constants/contract.constants';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import type { ContractMemberListItemDto } from '@/features/contracts/types/contract-member.dto';

export const useRoomContractData = (roomId: string) => {
  const params = { pageNo: 1, pageSize: 1, filter: { roomId, status: ContractStatus.ACTIVE } };
  const contractQuery = useQuery({
    queryKey: CONTRACT_QUERY_KEYS.LIST(params),
    queryFn: () => contractApi.getContracts(params),
  });
  const contract = contractQuery.data?.items[0];
  const contractId = contract?.id ?? '';
  const membersQuery = useQuery({
    queryKey: [...CONTRACT_QUERY_KEYS.MEMBERS(contractId), 'all'],
    enabled: Boolean(contractId),
    queryFn: async () => {
      const members: ContractMemberListItemDto[] = [];
      let pageNo = 1;
      let hasNextPage = true;
      while (hasNextPage) {
        const page = await contractApi.getContractMembers(contractId, { pageNo });
        members.push(...page.items);
        hasNextPage = page.pagination.hasNextPage;
        pageNo += 1;
      }
      return members.filter((member) => member.status === 'active');
    },
  });
  return { contract, contractQuery, membersQuery };
};
