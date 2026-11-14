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
  MyContractFilter,
  MyContractListItemDto,
  ContractTemplateDetailDto,
  ContractTemplateListItemDto,
  ContractUpdateRequestDto,
} from '../types/contract.dto';
import type {
  AddContractMemberRequestDto,
  CompleteContractCheckoutRequestDto,
  ContractCheckoutCompleteResponseDto,
  ContractMemberListItemDto,
  ContractMemberListFilter,
  LeaveContractMemberRequestDto,
} from '../types/contract-member.dto';

export const contractApi = {
  getMyContracts: (params?: ListParams<MyContractFilter>): Promise<Paginated<MyContractListItemDto>> =>
    http.getPage<MyContractListItemDto, MyContractFilter>('/me/contracts', params),

  getContracts: (params?: ListParams<ContractFilter>): Promise<Paginated<ContractListItemDto>> =>
    http.getPage<ContractListItemDto, ContractFilter>('/contracts', params),

  getContract: (id: string): Promise<ContractDetailDto> => http.get<ContractDetailDto>(`/contracts/${id}`),

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
    payload: ContractGenerateDraftRequestDto,
  ): Promise<ContractGenerateDraftResponseDto> =>
    http.post<ContractGenerateDraftResponseDto>(`/contracts/${id}/generate-draft-document`, payload),

  getContractMembers: (contractId: string, params?: ListParams): Promise<Paginated<ContractMemberListItemDto>> =>
    http.getPage<ContractMemberListItemDto, ContractMemberListFilter>('/contract-members', {
      ...params,
      filter: { contractId },
    }),

  addContractMember: (payload: AddContractMemberRequestDto): Promise<ContractMemberListItemDto> =>
    http.post<ContractMemberListItemDto>('/contract-members', payload),

  updateContractMember: (id: string, payload: { tenantPhone: string }): Promise<ContractMemberListItemDto> =>
    http.patch<ContractMemberListItemDto>(`/contract-members/${id}`, payload),

  leaveContractMember: (id: string, payload: LeaveContractMemberRequestDto): Promise<ContractMemberListItemDto> =>
    http.post<ContractMemberListItemDto>(`/contract-members/${id}/leave-contract`, payload),

  completeCheckout: (
    contractId: string,
    payload: CompleteContractCheckoutRequestDto,
  ): Promise<ContractCheckoutCompleteResponseDto> =>
    http.post<ContractCheckoutCompleteResponseDto>(`/contracts/${contractId}/complete-checkout`, payload),
};
