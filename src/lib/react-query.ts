import {
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Extracts a user-friendly error message from an unknown error or AxiosError.
 * Maps standard Rentify API error codes (§3 Error Codes) to readable notifications.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiError | undefined;
    if (errorData?.code) {
      // Map domain error codes to Vietnamese messages
      switch (errorData.code) {
        case 'INVALID TOKEN':
        case 'UNAUTHORIZED':
          return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        case 'FORBIDDEN':
          return 'Bạn không có quyền thực hiện hành động này.';
        case 'NOT FOUND':
        case 'RESOURCE_NOT_FOUND':
          return 'Không tìm thấy tài nguyên yêu cầu.';
        case 'VALIDATION FAILED':
        case 'VALIDATION_FAILED':
          return 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
        case "CAN'T DELETE":
          return 'Không thể xóa tài nguyên do ràng buộc trạng thái hoặc dữ liệu liên kết.';
        case 'CONFLICT':
          return 'Dữ liệu bị trùng lặp hoặc xung đột trạng thái.';
        case 'IDEMPOTENCY KEY REUSED':
          return 'Yêu cầu thanh toán đang được xử lý, vui lòng không gửi lại.';
        case 'RATE LIMIT EXCEEDED':
          return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.';
        case 'INTERNAL ERROR':
          return 'Đã xảy ra lỗi hệ thống từ máy chủ. Vui lòng thử lại sau.';
        default:
          return errorData.message || `Lỗi: ${errorData.code}`;
      }
    }

    if (error.response?.status === 500) {
      return 'Lỗi máy chủ (500). Vui lòng thử lại sau.';
    }
    if (error.response?.status === 404) {
      return 'Không tìm thấy tài nguyên yêu cầu (404).';
    }
    if (error.response?.status === 403) {
      return 'Bạn không có quyền truy cập (403).';
    }
    if (error.message === 'Network Error') {
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền.';
    }

    return error.message || 'Đã xảy ra lỗi trong quá trình xử lý.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
};

/**
 * Query Keys Factory for central cache invalidation
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  buildings: {
    all: ['buildings'] as const,
    detail: (id: string) => ['buildings', id] as const,
  },
  rooms: {
    all: ['rooms'] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    detail: (id: string) => ['invoices', id] as const,
  },
  contracts: {
    all: ['contracts'] as const,
    detail: (id: string) => ['contracts', id] as const,
  },
};

/**
 * Centralized QueryClient instance v5
 * - staleTime: 5 phút (5 * 60 * 1000)
 * - retry: 1 lần cho queries
 * - MutationCache & QueryCache onError tự động hiển thị toast Sonner
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        // Do not retry on 4xx client errors (401, 403, 404, 422)
        if (error instanceof AxiosError && error.response?.status && error.response.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Allow individual queries to suppress global error toast via meta: { suppressErrorToast: true }
      if (query.meta?.suppressErrorToast) {
        return;
      }
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Allow individual mutations to suppress global error toast via meta: { suppressErrorToast: true }
      if (mutation.meta?.suppressErrorToast) {
        return;
      }
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
});

export default queryClient;