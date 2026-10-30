import type { FieldError, FieldValues, UseFormSetError } from 'react-hook-form';
import type { Namespace, TFunction } from 'i18next';
import { getErrorMessage } from '@/lib/api/errors';

type TranslateFn = (key: string) => string;

/**
 * Message for a react-hook-form field error. Zod schemas store i18n keys
 * (`errors.*`) as messages; those are translated with the caller's namespace.
 */
export const getFieldError = <Ns extends Namespace>(
  error: FieldError | undefined,
  t: TFunction<Ns>
): string | undefined => {
  if (!error?.message) {
    return undefined;
  }
  return error.message.startsWith('errors.') ? (t as unknown as TranslateFn)(error.message) : error.message;
};

/** Shows an API error as the form-level `root.serverError`. */
export const setFormApiErrors = <TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  error: unknown
): void => {
  setError('root.serverError' as `root.${string}`, {
    type: 'server',
    message: getErrorMessage(error),
  });
};
