import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError } from '@/types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


let isRefreshing = false;
type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 204) {
      return undefined;
    }

    const contentType = (response.headers?.['content-type'] as string | undefined) || '';
    const responseType = response.config?.responseType;

    if (
      responseType === 'blob' ||
      responseType === 'arraybuffer' ||
      (contentType && !contentType.includes('application/json'))
    ) {
      return response.data;
    }

    if (
      response.data &&
      typeof response.data === 'object' &&
      'statusCode' in response.data &&
      'data' in response.data
    ) {
      if ('pagination' in response.data) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      return response.data.data;
    }

    return response.data;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    
    if (
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/password-reset')
    ) {
      return Promise.reject(error);
    }

    
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const currentRefreshToken = useAuthStore.getState().refreshToken;
    if (!currentRefreshToken) {
      isRefreshing = false;
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${returnUrl}`;
      }
      return Promise.reject(error);
    }

    try {
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken: currentRefreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      
      const responseBody = response.data?.data || response.data;
      const newAccessToken = responseBody?.accessToken;
      const newRefreshToken = responseBody?.refreshToken;

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint');
      }

      
      useAuthStore.getState().setAccessToken(newAccessToken);
      if (newRefreshToken) {
        useAuthStore.getState().setRefreshToken(newRefreshToken);
      }

      
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${returnUrl}`;
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
