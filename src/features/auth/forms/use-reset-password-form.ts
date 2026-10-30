import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getFieldError, setFormApiErrors } from '@/lib/form';
import { useResetPasswordMutation } from '../hooks/use-reset-password-mutation';
import { resetPasswordSchema, type ResetPasswordFormData } from './password.schema';

/** Form behind the link in the password-reset email (`?token=`). */
export const useResetPasswordForm = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const resetMutation = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });
  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit(async ({ newPassword }) => {
    try {
      await resetMutation.mutateAsync({ token, newPassword });
      navigate('/login', { replace: true });
    } catch (error) {
      setFormApiErrors(form.setError, error);
    }
  });

  return {
    register: form.register,
    errors: {
      newPassword: getFieldError(errors.newPassword, t),
      confirmPassword: getFieldError(errors.confirmPassword, t),
      serverError: errors.root?.serverError?.message,
    },
    isTokenMissing: !token,
    isSubmitting: resetMutation.isPending || form.formState.isSubmitting,
    handleSubmit,
  };
};
