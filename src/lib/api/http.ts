import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  ListParams,
  PaginatedApiResponse,
  Paginated,
} from '@/types/api';
import { apiClient } from './client';

// 204 responses have an empty body, hence the optional chaining.
const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>): T => response.data?.data;

const unwrapPage = <T>({ data }: AxiosResponse<PaginatedApiResponse<T>>): Paginated<T> => ({
  items: data.data,
  pagination: data.pagination,
});

/**
 * Typed wrappers around `apiClient` that strip the `{ statusCode, code, data }`
 * envelope, so feature APIs only declare the payload type.
 */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, config).then(unwrap),

  getPage: <T, TFilter extends object = Record<string, unknown>>(
    url: string,
    params?: ListParams<TFilter>,
    config?: AxiosRequestConfig
  ) => apiClient.get<PaginatedApiResponse<T>>(url, { ...config, params }).then(unwrapPage),

  getBlob: (url: string, config?: AxiosRequestConfig) =>
    apiClient.get<Blob>(url, { ...config, responseType: 'blob' }).then((res) => res.data),

  post: <T = void>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, body, config).then(unwrap),

  put: <T = void>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, body, config).then(unwrap),

  patch: <T = void>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, body, config).then(unwrap),

  delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config).then(unwrap),
};
