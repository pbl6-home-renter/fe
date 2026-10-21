import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { Role } from '@/types/role';
import {
  validateRegisterForm,
  type RegisterFormData,
  type RegisterRole,
  type AuthErrorKey,
} from '@/features/auth/validations/auth.validation';
import { useAuthFormState } from './use-auth-form-state';

export interface UseRegisterFormOptions {
  defaultRole?: RegisterRole;
  onSuccess?: (userRole: RegisterRole) => void;
  onError?: (error: unknown) => void;
}

export const useRegisterForm = (options?: UseRegisterFormOptions) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);

  const initialRole: RegisterRole = options?.defaultRole ?? Role.TENANT;

  const {
    values,
    errors,
    setFieldValue,
    setErrors,
    resetForm,
  } = useAuthFormState<RegisterFormData>({
    role: initialRole,
    fullname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const setRole = useCallback(
    (newRole: RegisterRole) => {
      setFieldValue('role', newRole);
    },
    [setFieldValue]
  );

  const handleChange = useCallback(
    <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => {
      setFieldValue(field, value);
    },
    [setFieldValue]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 1. Validate with Zod Register Schema
    const validation = validateRegisterForm(values);
    if (!validation.success && validation.errors) {
      const localizedErrors: Record<string, string> = {};
      Object.entries(validation.errors).forEach(([field, key]) => {
        localizedErrors[field] = t(key as AuthErrorKey);
      });
      setErrors(localizedErrors);
      return false;
    }

    setIsLoading(true);

    try {
      // 2. Mock/Execute registration authentication
      login(
        {
          id: `user-${Date.now()}`,
          name: values.fullname.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          role: values.role,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        },
        'mock-registered-access-token'
      );

      if (options?.onSuccess) {
        options.onSuccess(values.role);
      }

      // 3. Navigate to destination role dashboard
      navigate(getHomePathByRole(values.role), { replace: true });
      return true;
    } catch (err) {
      if (options?.onError) {
        options.onError(err);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    role: values.role,
    setRole,
    values,
    errors,
    isLoading,
    isTenant: values.role === Role.TENANT,
    isLandlord: values.role === Role.LANDLORD,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
