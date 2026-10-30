import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const isClientError = (error: unknown) =>
  isAxiosError(error) &&
  typeof error.response?.status === 'number' &&
  error.response.status >= 400 &&
  error.response.status < 500;

// Toasts for success/error are shown by `lib/api/client.ts`, not here.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
