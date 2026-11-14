import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { isInvalidCurrentPasswordError } from '@/lib/api/errors';
import { getFieldError } from '@/lib/form';
import { notify } from '@/lib/notifications/notify';
import { useAuthStore } from '@/stores/auth-store';
import { changePasswordSchema, type ChangePasswordFormData } from '../forms/password.schema';
import { useChangePasswordMutation } from './use-change-password-mutation';

export const useChangePasswordForm = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const mutation = useChangePasswordMutation();
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });
  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      form.reset();
      clearAuth();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
      notify.success(t('changePasswordSuccess'));
    } catch (error) {
      if (isInvalidCurrentPasswordError(error)) {
        form.setError('currentPassword', { type: 'server', message: t('invalidCurrentPassword') }, { shouldFocus: true });
      }
    }
  });

  return {
    register: form.register,
    handleSubmit,
    isSubmitting: mutation.isPending || form.formState.isSubmitting,
    errors: {
      currentPassword: getFieldError(errors.currentPassword, t),
      newPassword: getFieldError(errors.newPassword, t),
      confirmPassword: getFieldError(errors.confirmPassword, t),
    },
  };
};
