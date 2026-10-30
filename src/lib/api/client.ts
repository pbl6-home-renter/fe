import axios, { isCancel, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';
import { findApiSuccessMessage } from './api-messages';
import { getErrorMessage } from './errors';
import { attachRefreshTokenInterceptor } from './refresh-token';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Don't toast this request's success `code`, e.g. one file of a batch upload. */
    skipSuccessToast?: boolean;
    /** Don't toast this request's error, e.g. when a form shows it inline. */
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
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

attachRefreshTokenInterceptor(apiClient, API_BASE_URL);

// Registered after the refresh interceptor, so a 401 that gets refreshed is never toasted.
// The toast id is the message, so a request replayed after a refresh doesn't toast twice.
apiClient.interceptors.response.use(
  (response) => {
    const code = (response.data as Partial<ApiResponse<unknown>> | undefined)?.code;
    const { method, skipSuccessToast } = response.config;
    // Writes only: GET codes (e.g. `CURRENT_USER_FETCHED`) aren't news to the user.
    if (method !== 'get' && !skipSuccessToast && typeof code === 'string') {
      const message = findApiSuccessMessage(code);
      if (message) {
        toast.success(message, { id: message });
      }
    }
    return response;
  },
  (error: unknown) => {
    const skipErrorToast = axios.isAxiosError(error) && error.config?.skipErrorToast;
    if (!isCancel(error) && !skipErrorToast) {
      const message = getErrorMessage(error);
      toast.error(message, { id: message });
    }
    return Promise.reject(error);
  }
);
