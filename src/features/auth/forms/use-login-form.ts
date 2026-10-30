import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { getFieldError, setFormApiErrors } from '@/lib/form';
import { useLoginMutation } from '../hooks/use-login-mutation';
import { loginSchema, type LoginFormData } from './login.schema';

/** Same-origin path from `?redirect=` (or legacy `?returnUrl=`), ignoring open redirects. */
const useRedirectTarget = () => {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const raw = searchParams.get('redirect') || searchParams.get('returnUrl');
    return raw && raw.startsWith('/') && !raw.startsWith('//') ? decodeURIComponent(raw) : null;
  }, [searchParams]);
};

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const redirectTarget = useRedirectTarget();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', rememberMe: false },
    mode: 'onTouched',
  });
  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const { user, profile } = await loginMutation.mutateAsync({
        ...values,
        identifier: values.identifier.trim(),
      });
      const role = (user || profile)?.role;
      navigate(redirectTarget || (role ? getHomePathByRole(role) : '/'), { replace: true });
    } catch (error) {
      setFormApiErrors(form.setError, error);
    }
  });

  return {
    register: form.register,
    errors: {
      identifier: getFieldError(errors.identifier, t),
      password: getFieldError(errors.password, t),
      serverError: errors.root?.serverError?.message,
    },
    isSubmitting: loginMutation.isPending || form.formState.isSubmitting,
    handleSubmit,
  };
};
