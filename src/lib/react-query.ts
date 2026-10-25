import { useEffect, useRef } from 'react';
import {
  QueryClient,
  QueryCache,
  MutationCache,
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
  type QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { ApiError } from '@/types/api';
import {
  getApiErrorMessage,
  getApiSuccessMessage,
  getHttpStatusErrorMessage,
  getNetworkErrorMessage,
} from './api-code-i18n';

/**
 * Extracts business `code` string from an Axios error if present.
 */
export const getApiErrorCode = (error: unknown): string | null => {
  if (isAxiosError(error)) {
    const errorData = error.response?.data as ApiError | undefined;
    if (errorData && typeof errorData === 'object' && typeof errorData.code === 'string') {
      return errorData.code;
    }
  }
  return null;
};

/**
 * Extracts HTTP status code from an Axios error response.
 */
export const getApiErrorStatus = (error: unknown): number | null => {
  if (isAxiosError(error) && typeof error.response?.status === 'number') {
    return error.response.status;
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
    const status = error.response.status;
    return getHttpStatusErrorMessage(status);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getApiErrorMessage('', fallbackKey);
};

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          isAxiosError(error) &&
          typeof error.response?.status === 'number' &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
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
      if (query.meta?.suppressErrorToast) {
        return;
      }
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressErrorToast) {
        return;
      }
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
});

export const invalidateAuthQueries = async (): Promise<void> => {
  await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
};

export const resetAuthQueries = async (): Promise<void> => {
  await queryClient.resetQueries({ queryKey: queryKeys.auth.all });
};

export const clearAppCache = (): void => {
  queryClient.clear();
};

export interface UseAppQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'meta'> {
  suppressErrorToast?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useAppQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseAppQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const { suppressErrorToast, onSuccess, onError, ...queryOptions } = options;

  const result = useQuery({
    ...queryOptions,
    meta: {
      suppressErrorToast: Boolean(suppressErrorToast),
    },
  });

  const prevDataRef = useRef<TData | undefined>(undefined);
  const prevErrorRef = useRef<TError | null>(null);

  useEffect(() => {
    if (result.data !== undefined && result.data !== prevDataRef.current) {
      prevDataRef.current = result.data;
      onSuccess?.(result.data);
    }
  }, [result.data, onSuccess]);

  useEffect(() => {
    if (result.error && result.error !== prevErrorRef.current) {
      prevErrorRef.current = result.error;
      onError?.(result.error);
    }
  }, [result.error, onError]);

  return result;
}

export interface UseAppMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'meta'> {
  suppressErrorToast?: boolean;
  successCode?: string;
  successMessage?: string;
  invalidateKeys?: readonly QueryKey[] | QueryKey[];
}

export function useAppMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseAppMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const qc = useQueryClient();
  const {
    suppressErrorToast,
    successCode,
    successMessage,
    invalidateKeys,
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  return useMutation({
    ...mutationOptions,
    meta: {
      suppressErrorToast: Boolean(suppressErrorToast),
    },
    onSuccess: (...args) => {
      if (invalidateKeys && invalidateKeys.length > 0) {
        invalidateKeys.forEach((key) => {
          qc.invalidateQueries({ queryKey: key });
        });
      }

      if (successCode) {
        const message = getApiSuccessMessage(successCode);
        toast.success(message);
      } else if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
  });
}
