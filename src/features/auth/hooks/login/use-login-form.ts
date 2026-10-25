import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { loginSchema, type LoginFormData } from '@/features/auth/validations/login.validation';
import {
  setFormApiErrors,
  getFieldError,
} from '@/features/auth/validations/common.validation';
import { useLoginMutation } from '@/features/auth/hooks/auth/use-login-mutation';
import type { Role } from '@/types/role';

export interface UseLoginFormOptions {
  onSuccess?: (userRole: Role) => void;
  onError?: (error: unknown) => void;
}

export const useLoginForm = (options?: UseLoginFormOptions) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('auth');

  const loginMutation = useLoginMutation({
    suppressErrorToast: true,
  });

  const redirectTarget = useMemo(() => {
    const rawRedirect = searchParams.get('redirect') || searchParams.get('returnUrl');
    return rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? decodeURIComponent(rawRedirect)
      : null;
  }, [searchParams]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched',
  });

  const isSubmitting = loginMutation.isPending || form.formState.isSubmitting;
  const isLoading = isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await loginMutation.mutateAsync({
        identifier: values.identifier.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      });

      const user = response.user || response.profile;
      const role = user?.role;
      if (role) {
        options?.onSuccess?.(role);
      }

      const target = redirectTarget || (role ? getHomePathByRole(role) : '/');
      navigate(target, { replace: true });
      return true;
    } catch (err) {
      setFormApiErrors(form.setError, err);
      options?.onError?.(err);
      return false;
    }
  });

  return {
    form,
    register: form.register,
    control: form.control,
    getValues: form.getValues,
    errors: {
      identifier: getFieldError(form.formState.errors.identifier, t),
      password: getFieldError(form.formState.errors.password, t),
      serverError: form.formState.errors.root?.serverError?.message,
    },
    isSubmitting,
    isLoading,
    redirectTarget,
    handleSubmit,
    onSubmit: handleSubmit,
    resetForm: form.reset,
  };
};
