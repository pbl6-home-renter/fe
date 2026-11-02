import { useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractTemplateListItemDto } from '../types/contract.dto';

export const useContractTemplatesQuery = (params?: ListParams, enabled = true) =>
  useQuery<Paginated<ContractTemplateListItemDto>>({
    queryKey: CONTRACT_QUERY_KEYS.TEMPLATES(params),
    queryFn: () => contractApi.getContractTemplates(params),
    enabled,
  });
