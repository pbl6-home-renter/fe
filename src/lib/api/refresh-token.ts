import axios, { isAxiosError, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ROUTES } from '@/config/routes.config';
import { queryClient } from '@/lib/query/query-client';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/register', '/auth/password-reset'];

const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const redirectToLogin = () => {
  if (typeof window === 'undefined' || window.location.pathname.startsWith(ROUTES.LOGIN)) {
    return;
  }
  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `${ROUTES.LOGIN}?redirect=${returnUrl}`;
};

let pendingRefresh: Promise<TokenPair> | null = null;

/** One refresh operation shared by HTTP 401 handling and the Socket session. */
export const refreshSession = (baseURL: string): Promise<TokenPair> => {
  if (!pendingRefresh) {
    const refreshToken = useAuthStore.getState().refreshToken;
    pendingRefresh = (async () => {
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await axios.post<ApiResponse<TokenPair>>(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );
      const tokens = response.data?.data;
      if (!tokens?.accessToken) {
        throw new Error('No access token returned from refresh endpoint');
      }
      const auth = useAuthStore.getState();
      if (auth.refreshToken !== refreshToken) {
        throw new Error('Session changed while refreshing');
      }
      auth.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) auth.setRefreshToken(tokens.refreshToken);
      return tokens;
    })()
      .catch((error: unknown) => {
        const refreshRejected =
          isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403);
        if (useAuthStore.getState().refreshToken === refreshToken && (!refreshToken || refreshRejected)) {
          useAuthStore.getState().clearAuth();
          queryClient.clear();
          redirectToLogin();
        }
        throw error;
      })
      .finally(() => {
        pendingRefresh = null;
      });
  }
  return pendingRefresh;
};

export const attachRefreshTokenInterceptor = (client: AxiosInstance, baseURL: string) => {
  client.interceptors.response.use(undefined, async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as RetriableRequestConfig | undefined;
    if (!request || error.response?.status !== 401 || isAuthEndpoint(request.url) || request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      const { accessToken } = await refreshSession(baseURL);
      request.headers.Authorization = `Bearer ${accessToken}`;
      return client(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  });
};
