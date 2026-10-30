import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Endpoints whose 401 means "wrong credentials", not "access token expired". */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/register', '/auth/password-reset'];

const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const redirectToLogin = () => {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/login')) {
    return;
  }
  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/login?redirect=${returnUrl}`;
};

/**
 * On a 401, refreshes the token pair once and replays the request. Requests that
 * fail while a refresh is in flight wait for it instead of refreshing again.
 */
export const attachRefreshTokenInterceptor = (client: AxiosInstance, baseURL: string) => {
  let isRefreshing = false;
  let waitingRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  const settleWaitingRequests = (error: unknown, token: string | null) => {
    waitingRequests.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
    waitingRequests = [];
  };

  const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
    // Plain axios: the refresh call must not go through this interceptor again.
    const response = await axios.post<ApiResponse<TokenPair>>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const tokens = response.data?.data;
    if (!tokens?.accessToken) {
      throw new Error('No access token returned from refresh endpoint');
    }
    return tokens;
  };

  client.interceptors.response.use(undefined, async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as RetriableRequestConfig | undefined;

    if (
      !request ||
      error.response?.status !== 401 ||
      isAuthEndpoint(request.url) ||
      request._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      const token = await new Promise<string>((resolve, reject) => {
        waitingRequests.push({ resolve, reject });
      });
      request.headers.Authorization = `Bearer ${token}`;
      return client(request);
    }

    request._retry = true;
    isRefreshing = true;
    const { refreshToken, setAccessToken, setRefreshToken, clearAuth } = useAuthStore.getState();

    try {
      if (!refreshToken) {
        throw error;
      }
      const tokens = await refreshTokens(refreshToken);
      setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) {
        setRefreshToken(tokens.refreshToken);
      }

      settleWaitingRequests(null, tokens.accessToken);
      request.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return client(request);
    } catch (refreshError) {
      settleWaitingRequests(refreshError, null);
      clearAuth();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  });
};
