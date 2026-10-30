import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Role } from '@/types/role';
import { getFieldError, setFormApiErrors } from '@/lib/form';
import { useRegisterMutation } from '../hooks/use-register-mutation';
import { registerSchema, type RegisterFormData, type RegisterRole } from './register.schema';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: Role.TENANT,
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });
  const { errors } = form.formState;
  const role = useWatch({ control: form.control, name: 'role' });

  const setRole = (newRole: RegisterRole) => {
    form.setValue('role', newRole, { shouldValidate: true });
  };

  const handleSubmit = form.handleSubmit(async ({ name, phone, email, password, role }) => {
    try {
      await registerMutation.mutateAsync({ name, phone, email, password, role });
      navigate('/login', { replace: true });
    } catch (error) {
      setFormApiErrors(form.setError, error);
    }
  });

  return {
    register: form.register,
    errors: {
      name: getFieldError(errors.name, t),
      phone: getFieldError(errors.phone, t),
      email: getFieldError(errors.email, t),
      password: getFieldError(errors.password, t),
      confirmPassword: getFieldError(errors.confirmPassword, t),
      role: getFieldError(errors.role, t),
      serverError: errors.root?.serverError?.message,
    },
    setRole,
    isTenant: role === Role.TENANT,
    isLandlord: role === Role.LANDLORD,
    isSubmitting: registerMutation.isPending || form.formState.isSubmitting,
    handleSubmit,
  };
};
