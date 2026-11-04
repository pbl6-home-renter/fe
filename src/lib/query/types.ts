import type { InfiniteData, UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

/** Options a feature mutation hook lets its callers override (everything but `mutationFn`). */
export type MutationHookOptions<TData = unknown, TVariables = void> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
>;

/** Options a feature query hook lets callers override without changing its key or request. */
export type QueryHookOptions<TQueryFnData, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, Error, TData>,
  'queryKey' | 'queryFn'
>;

/** Options a feature infinite query hook exposes while retaining its cursor contract. */
export type InfiniteQueryHookOptions<TQueryFnData, TPageParam = unknown> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, Error, InfiniteData<TQueryFnData, TPageParam>, readonly unknown[], TPageParam>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;
