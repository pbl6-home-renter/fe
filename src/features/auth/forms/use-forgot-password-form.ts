import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getFieldError, setFormApiErrors } from '@/lib/form';
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
    } catch (error) {
      setFormApiErrors(form.setError, error);
    }
  });

  return {
    register: form.register,
    errors: {
      email: getFieldError(errors.email, t),
      serverError: errors.root?.serverError?.message,
    },
    isSubmitting: requestMutation.isPending || form.formState.isSubmitting,
    isSuccess: requestMutation.isSuccess,
    handleSubmit,
  };
};
