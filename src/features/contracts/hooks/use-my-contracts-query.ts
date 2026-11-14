import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import type { ListParams, Paginated } from '@/types/api';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { MyContractFilter, MyContractListItemDto } from '../types/contract.dto';

export const useMyContractsQuery = (
  params?: ListParams<MyContractFilter>,
  options?: QueryHookOptions<Paginated<MyContractListItemDto>>,
) => useQuery({ queryKey: CONTRACT_QUERY_KEYS.MY_LIST(params), queryFn: () => contractApi.getMyContracts(params), ...options });
