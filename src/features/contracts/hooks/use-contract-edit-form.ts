import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MutationHookOptions } from '@/lib/query/types';
import { useUpdateContractMutation } from './use-update-contract-mutation';
import { contractEditSchema, type ContractEditFormData } from '../forms/contract.schema';
import type { ContractDetailDto, ContractUpdateRequestDto } from '../types/contract.dto';

export interface UseContractEditFormOptions {
  contract: ContractDetailDto;
  onSuccess?: (contract: ContractDetailDto) => void;
  onCancel?: () => void;
  mutationOptions?: MutationHookOptions<
    ContractDetailDto,
    { id: string; payload: ContractUpdateRequestDto }
  >;
}

export const useContractEditForm = ({
  contract,
  onSuccess,
  onCancel,
  mutationOptions,
}: UseContractEditFormOptions) => {
  const updateMutation = useUpdateContractMutation(mutationOptions);

  const form = useForm<ContractEditFormData>({
    resolver: zodResolver(contractEditSchema),
    defaultValues: {
      vehicleCount: contract.vehicleCount ?? null,
      description: contract.description ?? '',
    },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload: ContractUpdateRequestDto = {
      vehicleCount:
        values.vehicleCount !== undefined && values.vehicleCount !== null
          ? Number(values.vehicleCount)
          : null,
      description: values.description?.trim() || null,
    };

    updateMutation.mutate(
      { id: contract.id, payload },
      {
        onSuccess: (data) => {
          onSuccess?.(data);
        },
      }
    );
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: updateMutation.isPending,
  };
};
