import axios, { isCancel, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { notify } from '@/lib/notifications/notify';
import type { ApiResponse } from '@/types/api';
import { findApiSuccessMessage } from './api-messages';
import { getErrorMessage } from './errors';
import { attachRefreshTokenInterceptor, isAuthEndpoint } from './refresh-token';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Don't toast this request's success `code`, e.g. one file of a batch upload. */
    skipSuccessToast?: boolean;
    /** Don't toast an error already handled in context, such as a quiet image request. */
    skipErrorToast?: boolean;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Axios instance for the Rentify API. Returns raw `AxiosResponse`s; use the
 * typed helpers in `./http` instead of calling it directly from features.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && !isAuthEndpoint(config.url) && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Binary downloads still return JSON envelopes for API errors.
apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
    try {
      error.response.data = JSON.parse(await error.response.data.text()) as unknown;
    } catch {
      // Fall back to the status-based error message for malformed JSON.
    }
  }
  return Promise.reject(error);
});

attachRefreshTokenInterceptor(apiClient, API_BASE_URL);

// Registered after the refresh interceptor, so a 401 that gets refreshed is never toasted.
// The shared notifier deduplicates equal messages, including replayed requests.
apiClient.interceptors.response.use(
  (response) => {
    const code = (response.data as Partial<ApiResponse<unknown>> | undefined)?.code;
    const { method, skipSuccessToast } = response.config;
    // Writes only: GET codes (e.g. `CURRENT_USER_FETCHED`) aren't news to the user.
    if (method !== 'get' && !skipSuccessToast && typeof code === 'string') {
      const message = findApiSuccessMessage(code);
      if (message) {
        notify.success(message);
      }
    }
    return response;
  },
  (error: unknown) => {
    const skipErrorToast = axios.isAxiosError(error) && error.config?.skipErrorToast;
    if (!isCancel(error) && !skipErrorToast) {
      const message = getErrorMessage(error);
      notify.error(message);
    }
    return Promise.reject(error);
  },
);
