import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse, RefreshTokenResponseData } from '@/types/api';

// Create base axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mutex flag & request queue to handle concurrent 401 refresh token race condition
let isRefreshing = false;
type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor: Attach Authorization Bearer token from Zustand auth-store
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * - 2xx: Unwrap `response.data.data` automatically if present in standard ApiResponse envelope
 * - 401 Unauthorized: Perform thread-safe silent refresh with failed queue
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If response matches standard Rentify ApiResponse wrapper ({ statusCode, code, data })
    if (
      response.data &&
      typeof response.data === 'object' &&
      'statusCode' in response.data &&
      'data' in response.data
    ) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If there is no request config or not a 401 error, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    // Skip refresh token logic on login and refresh endpoints to avoid infinite loops
    if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If request was already retried once and failed again, do not retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refresh token request is currently in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call POST /auth/refresh. Refresh token cookie is sent automatically (withCredentials: true)
      const refreshResponse = await axios.post<
        ApiResponse<RefreshTokenResponseData> | RefreshTokenResponseData
      >(
        `${apiClient.defaults.baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Extract new accessToken from response (supporting both wrapped and raw formats)
      let newAccessToken = '';
      const responseBody = refreshResponse.data;
      if (
        responseBody &&
        typeof responseBody === 'object' &&
        'data' in responseBody &&
        responseBody.data &&
        typeof responseBody.data === 'object' &&
        'accessToken' in responseBody.data
      ) {
        newAccessToken = (responseBody as ApiResponse<RefreshTokenResponseData>).data.accessToken;
      } else if (
        responseBody &&
        typeof responseBody === 'object' &&
        'accessToken' in responseBody
      ) {
        newAccessToken = (responseBody as RefreshTokenResponseData).accessToken;
      }

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint');
      }

      // Update access token in Zustand store
      useAuthStore.getState().setAccessToken(newAccessToken);

      // Update Authorization header for original request and retry queue
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed: clear store, reject queued requests and redirect to /login
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${returnUrl}`;
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

