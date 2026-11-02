import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractFilter, ContractListItemDto } from '../types/contract.dto';

export const useContractsQuery = (
  params?: ListParams<ContractFilter>,
  enabled = true
) =>
  useQuery<Paginated<ContractListItemDto>>({
    queryKey: CONTRACT_QUERY_KEYS.LIST(params),
    queryFn: () => contractApi.getContracts(params),
    placeholderData: keepPreviousData,
    enabled,
  });
