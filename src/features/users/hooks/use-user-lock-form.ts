import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLockSchema, type UserLockFormData } from '../forms/user-lock.schema';
import { useLockUserMutation } from './use-lock-user-mutation';

export interface UseUserLockFormOptions {
  userId: string;
  isOpen?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useUserLockForm = ({ userId, isOpen = true, onSuccess, onCancel }: UseUserLockFormOptions) => {
  const lockMutation = useLockUserMutation();
  const prevOpenRef = useRef(false);

  const form = useForm<UserLockFormData>({
    resolver: zodResolver(userLockSchema),
    defaultValues: {
      lockReason: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (wasJustOpened) {
      form.reset({ lockReason: '' });
    }
  }, [isOpen, form]);

  const onSubmit = form.handleSubmit((values) => {
    lockMutation.mutate(
      {
        userId,
        payload: {
          lockReason: values.lockReason.trim(),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: lockMutation.isPending,
  };
};
