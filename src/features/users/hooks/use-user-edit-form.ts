import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userEditSchema, type UserEditFormData } from '../forms/user-edit.schema';
import { useUpdateUserAdminMutation } from './use-update-user-admin-mutation';

export interface UseUserEditFormOptions {
  userId: string;
  initialValues: {
    name: string;
    phone: string;
  };
  isOpen?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useUserEditForm = ({
  userId,
  initialValues,
  isOpen = true,
  onSuccess,
  onCancel,
}: UseUserEditFormOptions) => {
  const updateMutation = useUpdateUserAdminMutation();
  const prevOpenRef = useRef(false);

  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  // Only reset form values when the dialog opens or the target userId changes,
  // preventing user keystrokes from being wiped out on re-render.
  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (wasJustOpened || (isOpen && userId)) {
      form.reset({
        name: initialValues.name,
        phone: initialValues.phone,
      });
    }
  }, [isOpen, userId, initialValues.name, initialValues.phone, form]);

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(
      {
        userId,
        payload: {
          name: values.name.trim(),
          phone: values.phone.trim(),
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  });

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: updateMutation.isPending,
  };
};
