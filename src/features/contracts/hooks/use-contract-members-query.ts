import { useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractMemberListItemDto } from '../types/contract-member.dto';

export const useContractMembersQuery = (
  contractId: string,
  params?: ListParams,
  options?: QueryHookOptions<Paginated<ContractMemberListItemDto>> | boolean,
) => {
  const queryOptions = typeof options === 'boolean' ? { enabled: options } : options;

  return useQuery<Paginated<ContractMemberListItemDto>>({
    queryKey: CONTRACT_QUERY_KEYS.MEMBERS(contractId, params),
    queryFn: () => contractApi.getContractMembers(contractId, params),
    enabled: Boolean(contractId) && (queryOptions?.enabled ?? true),
    ...queryOptions,
  });
};
