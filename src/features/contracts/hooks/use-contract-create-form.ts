import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MutationHookOptions } from '@/lib/query/types';
import { useCreateContractMutation } from './use-create-contract-mutation';
import { contractCreateSchema, type ContractCreateFormData } from '../forms/contract.schema';
import type { ContractCreateRequestDto, ContractDetailDto } from '../types/contract.dto';

export interface UseContractCreateFormOptions {
  defaultBuildingId?: string;
  defaultRoomId?: string;
  onSuccess?: (contract: ContractDetailDto) => void;
  onCancel?: () => void;
  mutationOptions?: MutationHookOptions<ContractDetailDto, ContractCreateRequestDto>;
}

export const useContractCreateForm = ({
  defaultBuildingId = '',
  defaultRoomId = '',
  onSuccess,
  onCancel,
  mutationOptions,
}: UseContractCreateFormOptions = {}) => {
  const createMutation = useCreateContractMutation(mutationOptions);

  const form = useForm<ContractCreateFormData>({
    resolver: zodResolver(contractCreateSchema),
    defaultValues: {
      buildingId: defaultBuildingId,
      roomId: defaultRoomId,
      tenantName: '',
      tenantPhone: '',
      rentPrice: 0,
      depositAmount: 0,
      startDate: '',
      endDate: '',
      vehicleCount: null,
    },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload: ContractCreateRequestDto = {
      roomId: values.roomId,
      tenantName: values.tenantName.trim(),
      tenantPhone: values.tenantPhone.trim(),
      rentPrice: Number(values.rentPrice),
      depositAmount: Number(values.depositAmount),
      startDate: values.startDate,
      endDate: values.endDate,
      vehicleCount:
        values.vehicleCount !== undefined && values.vehicleCount !== null
          ? Number(values.vehicleCount)
          : null,
    };

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        form.reset();
        onSuccess?.(data);
      },
    });
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: createMutation.isPending,
  };
};
