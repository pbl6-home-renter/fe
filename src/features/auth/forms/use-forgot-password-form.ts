import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getFieldError } from '@/lib/form';
import { useRequestPasswordResetMutation } from '../hooks/use-request-password-reset-mutation';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './password.schema';

export const useForgotPasswordForm = () => {
  const { t } = useTranslation('auth');
  const requestMutation = useRequestPasswordResetMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });
  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await requestMutation.mutateAsync({ email: values.email.trim() });
    } catch {
      // API errors are shown by the shared interceptor.
    }
  });

  return {
    register: form.register,
    errors: {
      email: getFieldError(errors.email, t),
    },
    isSubmitting: requestMutation.isPending || form.formState.isSubmitting,
    isSuccess: requestMutation.isSuccess,
    handleSubmit,
  };
};
