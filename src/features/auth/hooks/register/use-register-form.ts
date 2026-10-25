import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Role } from '@/types/role';
import {
  registerSchema,
  toRegisterPayload,
  type RegisterFormData,
  type RegisterRole,
} from '@/features/auth/validations/register.validation';
import {
  setFormApiErrors,
  getFieldError,
} from '@/features/auth/validations/common.validation';
import { useRegisterMutation } from '@/features/auth/hooks/auth/use-register-mutation';
import type { AuthRegisterResponseDto } from '@/features/auth/types/auth.dto';

export interface UseRegisterFormOptions {
  defaultRole?: RegisterRole;
  onSuccess?: (response: AuthRegisterResponseDto) => void;
  onError?: (error: unknown) => void;
}

export const useRegisterForm = (options?: UseRegisterFormOptions) => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const registerMutation = useRegisterMutation({
    suppressErrorToast: true,
  });

  const defaultRole = options?.defaultRole ?? Role.TENANT;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const currentRole =
    useWatch({
      control: form.control,
      name: 'role',
      defaultValue: defaultRole,
    }) ?? defaultRole;

  const setRole = (newRole: RegisterRole) => {
    form.setValue('role', newRole, { shouldValidate: true });
  };

  const isSubmitting = registerMutation.isPending || form.formState.isSubmitting;
  const isLoading = isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = toRegisterPayload(values);
      const response = await registerMutation.mutateAsync(payload);

      options?.onSuccess?.(response);
      navigate('/login', { replace: true });
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
      name: getFieldError(form.formState.errors.name, t),
      phone: getFieldError(form.formState.errors.phone, t),
      email: getFieldError(form.formState.errors.email, t),
      password: getFieldError(form.formState.errors.password, t),
      confirmPassword: getFieldError(form.formState.errors.confirmPassword, t),
      role: getFieldError(form.formState.errors.role, t),
      serverError: form.formState.errors.root?.serverError?.message,
    },
    role: currentRole,
    setRole,
    isTenant: currentRole === Role.TENANT,
    isLandlord: currentRole === Role.LANDLORD,
    isSubmitting,
    isLoading,
    handleSubmit,
    onSubmit: handleSubmit,
    resetForm: form.reset,
  };
};
