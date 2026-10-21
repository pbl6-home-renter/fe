import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { Role } from '@/types/role';
import {
  validateLoginForm,
  type LoginFormData,
  type AuthErrorKey,
} from '@/features/auth/validations/auth.validation';
import { useAuthFormState } from './use-auth-form-state';

export interface UseLoginFormOptions {
  onSuccess?: (userRole: Role) => void;
  onError?: (error: unknown) => void;
}

export const useLoginForm = (options?: UseLoginFormOptions) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);

  const {
    values,
    errors,
    setFieldValue,
    setErrors,
    resetForm,
  } = useAuthFormState<LoginFormData>({
    email: '',
    password: '',
  });

  // Calculate redirect target from query parameter
  const redirectTarget = useMemo(() => {
    const rawRedirect = searchParams.get('redirect') || searchParams.get('returnUrl');
    return rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? decodeURIComponent(rawRedirect)
      : null;
  }, [searchParams]);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFieldValue(field, value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 1. Validation with Zod Schema
    const validation = validateLoginForm(values);
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
      // Determine demo role from email input or default to Landlord
      let role: Role = Role.LANDLORD;
      let userName = 'Trần Thị Chủ Nhà';

      if (values.email.toLowerCase().includes('tenant')) {
        role = Role.TENANT;
        userName = 'Nguyễn Văn Thuê';
      } else if (values.email.toLowerCase().includes('admin')) {
        role = Role.ADMIN;
        userName = 'Quản trị viên Rentify';
      }

      // Mock user login session
      login(
        {
          id: `user-${Date.now()}`,
          name: userName,
          email: values.email || 'user@rentify.vn',
          role,
          status: 'active',
          phone: '0901234567',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        },
        'mock-access-token'
      );

      if (options?.onSuccess) {
        options.onSuccess(role);
      }

      // Navigate to returnUrl or default home path
      const target = redirectTarget || getHomePathByRole(role);
      navigate(target, { replace: true });
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
    values,
    errors,
    isLoading,
    redirectTarget,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
