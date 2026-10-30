export const AUTH_QUERY_KEYS = {
  ALL: ['auth'],
  ME: ['auth', 'me'],
} as const;

/** Zod messages: i18n keys in the `auth` namespace, translated by `getFieldError`. */
export const AUTH_VALIDATION_KEYS = {
  IDENTIFIER_REQUIRED: 'errors.identifierRequired',
  NAME_REQUIRED: 'errors.nameRequired',
  NAME_MIN: 'errors.nameMin',
  PHONE_REQUIRED: 'errors.phoneRequired',
  PHONE_INVALID: 'errors.phoneInvalid',
  EMAIL_REQUIRED: 'errors.emailRequired',
  EMAIL_INVALID: 'errors.invalidEmail',
  PASSWORD_REQUIRED: 'errors.passwordRequired',
  PASSWORD_MIN: 'errors.passwordMinLength',
  CONFIRM_PASSWORD_REQUIRED: 'errors.confirmPasswordRequired',
  PASSWORD_MISMATCH: 'errors.passwordMismatch',
  TOKEN_REQUIRED: 'errors.tokenRequired',
  CURRENT_PASSWORD_REQUIRED: 'errors.currentPasswordRequired',
  NEW_PASSWORD_REQUIRED: 'errors.newPasswordRequired',
} as const;
