import { i18n } from '@/i18n/i18n';

export const AUTH_SUCCESS_CODES = {
  REGISTERED: 'REGISTERED',
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  SESSION_REFRESHED: 'SESSION_REFRESHED',
  PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  CURRENT_USER_FETCHED: 'CURRENT_USER_FETCHED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
} as const;

export type AuthSuccessCode = (typeof AUTH_SUCCESS_CODES)[keyof typeof AUTH_SUCCESS_CODES];

export const AUTH_ERROR_CODES = {
  AUTH_LOGIN_INVALID_CREDENTIALS: 'AUTH_LOGIN_INVALID_CREDENTIALS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  AUTH_REGISTER_ROLE_NOT_ALLOWED: 'AUTH_REGISTER_ROLE_NOT_ALLOWED',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_USED: 'TOKEN_USED',
  TOKEN_REUSED: 'TOKEN_REUSED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const COMMON_ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  VALIDATION_FAILED_SPACE: 'VALIDATION FAILED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_EXCEEDED_SPACE: 'RATE LIMIT EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INTERNAL_ERROR: 'INTERNAL ERROR',
  INVALID_TOKEN: 'INVALID TOKEN',
  CANT_DELETE: "CAN'T DELETE",
  IDEMPOTENCY_KEY_REUSED: 'IDEMPOTENCY KEY REUSED',
} as const;

export type CommonErrorCode = (typeof COMMON_ERROR_CODES)[keyof typeof COMMON_ERROR_CODES];

const translateKey = (key: string): string => {
  return (i18n.t as unknown as (k: string) => string)(key);
};

/**
 * Returns localized text for a specific API error code.
 */
export const getApiErrorMessage = (code: string, fallbackKey?: string): string => {
  if (code) {
    const authCodeKey = `auth:apiErrors.${code}`;
    if (i18n.exists(authCodeKey)) {
      return translateKey(authCodeKey);
    }

    const commonCodeKey = `common:apiErrors.${code}`;
    if (i18n.exists(commonCodeKey)) {
      return translateKey(commonCodeKey);
    }
  }

  if (fallbackKey && i18n.exists(fallbackKey)) {
    return translateKey(fallbackKey);
  }

  return translateKey('common:apiErrors.fallback');
};

/**
 * Returns localized text for a specific API success code.
 */
export const getApiSuccessMessage = (code: string, fallbackKey?: string): string => {
  const authKey = `auth:apiSuccess.${code}`;
  if (i18n.exists(authKey)) {
    return translateKey(authKey);
  }

  const commonKey = `common:apiSuccess.${code}`;
  if (i18n.exists(commonKey)) {
    return translateKey(commonKey);
  }

  if (fallbackKey && i18n.exists(fallbackKey)) {
    return translateKey(fallbackKey);
  }

  return translateKey('common:apiSuccess.fallback');
};

/**
 * Returns localized text for standard HTTP status codes.
 */
export const getHttpStatusErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return translateKey('common:apiErrors.BAD_REQUEST');
    case 401:
      return translateKey('common:apiErrors.UNAUTHORIZED');
    case 403:
      return translateKey('common:apiErrors.FORBIDDEN');
    case 404:
      return translateKey('common:apiErrors.NOT_FOUND');
    case 409:
      return translateKey('common:apiErrors.CONFLICT');
    case 422:
      return translateKey('common:apiErrors.VALIDATION_FAILED');
    case 429:
      return translateKey('common:apiErrors.TOO_MANY_REQUESTS');
    case 500:
      return translateKey('common:apiErrors.INTERNAL_SERVER_ERROR');
    default:
      return translateKey('common:apiErrors.fallback');
  }
};

/**
 * Returns localized text for network connection errors.
 */
export const getNetworkErrorMessage = (): string => {
  return translateKey('common:apiErrors.networkError');
};
