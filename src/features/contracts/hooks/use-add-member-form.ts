import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberSchema, type AddMemberFormValues } from '../forms/contract-member.schema';
import { useAddContractMemberMutation } from './use-add-contract-member-mutation';
import type { ContractDetailDto } from '../types/contract.dto';

interface UseAddMemberFormProps {
  contract: ContractDetailDto;
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const useAddMemberForm = ({ contract, open, onSuccess, onClose }: UseAddMemberFormProps) => {
  const addMutation = useAddContractMemberMutation();

  const initialJoinedAt = (() => {
    const today = new Date().toISOString().slice(0, 10);
    if (today >= contract.startDate && today <= contract.endDate) {
      return today;
    }
    return contract.startDate;
  })();

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      tenantName: '',
      tenantPhone: '',
      joinedAt: initialJoinedAt,
    },
    mode: 'onTouched',
  });

  const { reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        tenantName: '',
        tenantPhone: '',
        joinedAt: initialJoinedAt,
      });
    }
  }, [open, initialJoinedAt, reset]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await addMutation.mutateAsync({
        contractId: contract.id,
        tenantName: values.tenantName.trim(),
        tenantPhone: values.tenantPhone.trim(),
        joinedAt: values.joinedAt,
      });
      onSuccess();
      onClose();
    } catch {
      // Toast notification is handled by the global API client interceptor
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: addMutation.isPending,
  };
};
