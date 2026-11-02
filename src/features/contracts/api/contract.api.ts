import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  ContractActivateRequestDto,
  ContractApplyTemplateRequestDto,
  ContractCreateRequestDto,
  ContractDetailDto,
  ContractFilter,
  ContractGenerateDraftRequestDto,
  ContractGenerateDraftResponseDto,
  ContractListItemDto,
  ContractTemplateDetailDto,
  ContractTemplateListItemDto,
  ContractUpdateRequestDto,
} from '../types/contract.dto';

export const contractApi = {
  getContracts: (params?: ListParams<ContractFilter>): Promise<Paginated<ContractListItemDto>> =>
    http.getPage<ContractListItemDto, ContractFilter>('/contracts', params),

  getContract: (id: string): Promise<ContractDetailDto> =>
    http.get<ContractDetailDto>(`/contracts/${id}`),

  createContract: (payload: ContractCreateRequestDto): Promise<ContractDetailDto> =>
    http.post<ContractDetailDto>('/contracts', payload),

  updateContract: (id: string, payload: ContractUpdateRequestDto): Promise<ContractDetailDto> =>
    http.patch<ContractDetailDto>(`/contracts/${id}`, payload),

  activateContract: (id: string, payload: ContractActivateRequestDto): Promise<ContractDetailDto> =>
    http.post<ContractDetailDto>(`/contracts/${id}/activate-contract`, payload),

  getContractTemplates: (params?: ListParams): Promise<Paginated<ContractTemplateListItemDto>> =>
    http.getPage<ContractTemplateListItemDto>('/contract-templates', params),

  getContractTemplate: (templateKey: string): Promise<ContractTemplateDetailDto> =>
    http.get<ContractTemplateDetailDto>(`/contract-templates/${templateKey}`),

  applyTemplate: (id: string, payload: ContractApplyTemplateRequestDto): Promise<ContractDetailDto> =>
    http.put<ContractDetailDto>(`/contracts/${id}/apply-template`, payload),

  generateDraftDocument: (
    id: string,
    payload: ContractGenerateDraftRequestDto
  ): Promise<ContractGenerateDraftResponseDto> =>
    http.post<ContractGenerateDraftResponseDto>(`/contracts/${id}/generate-draft-document`, payload),
};
