import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';
import {
  getApiErrorMessage,
  getHttpStatusErrorMessage,
  getNetworkErrorMessage,
} from './api-messages';

/**
 * Extracts business `code` string from an Axios error if present.
 */
export const getApiErrorCode = (error: unknown): string | null => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const code = error.response?.data?.code;
    if (typeof code === 'string') {
      return code;
    }
  }
  return null;
};

/**
 * Converts any API or system error into a user-friendly, localized message for UI.
 */
export const getErrorMessage = (error: unknown, fallbackKey?: string): string => {
  const code = getApiErrorCode(error);
  if (code) {
    return getApiErrorMessage(code, fallbackKey);
  }

  if (isAxiosError(error)) {
    if (error.message === 'Network Error' || !error.response) {
      return getNetworkErrorMessage();
    }
    return getHttpStatusErrorMessage(error.response.status);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getApiErrorMessage('', fallbackKey);
};
