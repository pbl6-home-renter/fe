import { i18n } from '@/i18n/i18n';

const translateKey = (key: string): string => {
  return (i18n.t as unknown as (k: string) => string)(key);
};

/** Namespaces searched for API codes, feature namespaces first, `common` last. */
const API_CODE_NAMESPACES = ['auth', 'media', 'common'] as const;

const findApiCodeKey = (section: 'apiErrors' | 'apiSuccess', code: string): string | undefined =>
  API_CODE_NAMESPACES.map((ns) => `${ns}:${section}.${code}`).find((key) => i18n.exists(key));

/**
 * Returns localized text for a specific API error code.
 */
export const getApiErrorMessage = (code: string, fallbackKey?: string): string => {
  const codeKey = code ? findApiCodeKey('apiErrors', code) : undefined;
  if (codeKey) {
    return translateKey(codeKey);
  }

  if (fallbackKey && i18n.exists(fallbackKey)) {
    return translateKey(fallbackKey);
  }

  return translateKey('common:apiErrors.fallback');
};

/**
 * Localized text for an API success code, or `null` when the code has no
 * `<ns>:apiSuccess.<CODE>` translation (such codes are not meant to be shown).
 */
export const findApiSuccessMessage = (code: string): string | null => {
  const codeKey = findApiCodeKey('apiSuccess', code);
  return codeKey ? translateKey(codeKey) : null;
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
