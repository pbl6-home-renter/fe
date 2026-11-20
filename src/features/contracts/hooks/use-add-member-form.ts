import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberSchema, type AddMemberFormValues } from '../forms/contract-member.schema';
import { useAddContractMemberMutation } from './use-add-contract-member-mutation';
import { chatApi } from '@/features/chat/api/chat.api';
import { roomApi } from '@/features/rooms/api/room.api';
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
      const added = await addMutation.mutateAsync({
        contractId: contract.id,
        tenantName: values.tenantName.trim(),
        tenantPhone: values.tenantPhone.trim(),
        joinedAt: values.joinedAt,
      });

      if (added?.tenantId) {
        try {
          const res = await chatApi.getContractConversation(contract.id);
          const conversation = res?.items?.[0];
          if (conversation?.id) {
            await chatApi.addMembers(conversation.id, { userIds: [added.tenantId] });
          }
        } catch {
          // Failure to add to contract chat doesn't block contract member addition
        }

        try {
          let bId = contract.buildingId;
          if (!bId && contract.roomId) {
            const room = await roomApi.getRoom(contract.roomId);
            bId = room?.buildingId;
          }
          if (bId) {
            const bRes = await chatApi.getBuildingConversation(bId);
            const bConv = bRes?.items?.[0];
            if (bConv?.id) {
              await chatApi.addMembers(bConv.id, { userIds: [added.tenantId] });
            }
          }
        } catch {
          // Failure to add to building chat is non-fatal
        }
      }

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
