import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { leaveMemberSchema, type LeaveMemberFormValues } from '../forms/contract-member.schema';
import { useLeaveContractMemberMutation } from './use-leave-contract-member-mutation';
import type { ContractMemberListItemDto } from '../types/contract-member.dto';
import type { ContractDetailDto } from '../types/contract.dto';

interface UseLeaveMemberModalProps {
  contract: ContractDetailDto;
  onSuccess: () => void;
}

export const useLeaveMemberModal = ({ contract, onSuccess }: UseLeaveMemberModalProps) => {
  const { t } = useTranslation('contracts');
  const [selectedMember, setSelectedMember] = useState<ContractMemberListItemDto | null>(null);
  const leaveMutation = useLeaveContractMemberMutation();

  const form = useForm<LeaveMemberFormValues>({
    resolver: zodResolver(leaveMemberSchema),
    defaultValues: {
      leftOn: new Date().toISOString().slice(0, 10),
    },
    mode: 'onTouched',
  });

  const handleOpen = (member: ContractMemberListItemDto) => {
    setSelectedMember(member);
    const today = new Date().toISOString().slice(0, 10);
    const defaultDate = today >= member.joinedAt ? today : member.joinedAt;
    form.reset({ leftOn: defaultDate });
  };

  const handleClose = () => {
    setSelectedMember(null);
    form.reset();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!selectedMember) return;

    if (values.leftOn < selectedMember.joinedAt) {
      form.setError('leftOn', {
        type: 'manual',
        message: t('errors.leftDateBeforeJoined'),
      });
      return;
    }

    if (values.leftOn > contract.endDate) {
      form.setError('leftOn', {
        type: 'manual',
        message: t('errors.leftDateAfterEnd'),
      });
      return;
    }

    try {
      await leaveMutation.mutateAsync({
        id: selectedMember.id,
        payload: {
          contractId: contract.id,
          leftOn: values.leftOn,
        },
      });
      onSuccess();
      handleClose();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        form.setError('leftOn', {
          type: 'manual',
          message: t('errors.leftDateInvalid'),
        });
      }
    }
  });

  return {
    selectedMember,
    isOpen: Boolean(selectedMember),
    handleOpen,
    handleClose,
    form,
    handleSubmit,
    isSubmitting: leaveMutation.isPending,
  };
};
