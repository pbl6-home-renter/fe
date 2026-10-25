import type { FieldValues, UseFormSetError, FieldError } from 'react-hook-form';
import type { TFunction } from 'i18next';
import { getErrorMessage } from '@/lib/react-query';

export const AUTH_VALIDATION_KEYS = {
  IDENTIFIER_REQUIRED: 'errors.identifierRequired',
  NAME_REQUIRED: 'errors.nameRequired',
  NAME_MIN: 'errors.nameMin',
  FULLNAME_REQUIRED: 'errors.fullnameRequired',
  FULLNAME_MIN: 'errors.fullnameMin',
  PHONE_REQUIRED: 'errors.phoneRequired',
  PHONE_INVALID: 'errors.phoneInvalid',
  EMAIL_REQUIRED: 'errors.emailRequired',
  EMAIL_INVALID: 'errors.invalidEmail',
  PASSWORD_REQUIRED: 'errors.passwordRequired',
  PASSWORD_MIN: 'errors.passwordMinLength',
  CONFIRM_PASSWORD_REQUIRED: 'errors.confirmPasswordRequired',
  PASSWORD_MISMATCH: 'errors.passwordMismatch',
  ROLE_REQUIRED: 'errors.roleRequired',
  TOKEN_REQUIRED: 'errors.tokenRequired',
  CURRENT_PASSWORD_REQUIRED: 'errors.currentPasswordRequired',
  NEW_PASSWORD_REQUIRED: 'errors.newPasswordRequired',
} as const;

export type AuthErrorKey = (typeof AUTH_VALIDATION_KEYS)[keyof typeof AUTH_VALIDATION_KEYS];

export type TranslateFn = TFunction<'auth'>;

export const getFieldError = (
  error: FieldError | undefined,
  t: TranslateFn
): string | undefined => {
  if (!error?.message) {
    return undefined;
  }
  return error.message.startsWith('errors.')
    ? (t as unknown as (k: string) => string)(error.message)
    : error.message;
};

export const setFormApiErrors = <TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  error: unknown
): void => {
  const message = getErrorMessage(error);

  setError('root.serverError' as `root.${string}`, {
    type: 'server',
    message,
  });
};
