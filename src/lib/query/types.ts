import type { UseMutationOptions } from '@tanstack/react-query';

/** Options a feature mutation hook lets its callers override (everything but `mutationFn`). */
export type MutationHookOptions<TData = unknown, TVariables = void> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
>;
