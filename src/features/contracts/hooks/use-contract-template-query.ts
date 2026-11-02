import { useQuery } from '@tanstack/react-query';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractTemplateDetailDto } from '../types/contract.dto';

export const useContractTemplateQuery = (templateKey?: string, enabled = true) =>
  useQuery<ContractTemplateDetailDto>({
    queryKey: CONTRACT_QUERY_KEYS.TEMPLATE_DETAIL(templateKey),
    queryFn: () => contractApi.getContractTemplate(templateKey!),
    enabled: Boolean(templateKey) && enabled,
  });
