import { useQuery } from '@tanstack/react-query';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractDetailDto } from '../types/contract.dto';

export const useContractQuery = (id?: string, enabled = true) =>
  useQuery<ContractDetailDto>({
    queryKey: CONTRACT_QUERY_KEYS.DETAIL(id),
    queryFn: () => contractApi.getContract(id!),
    enabled: Boolean(id) && enabled,
  });
