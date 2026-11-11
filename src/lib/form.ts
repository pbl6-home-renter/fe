import type { FieldError } from 'react-hook-form';
import type { Namespace, TFunction } from 'i18next';

type TranslateFn = (key: string) => string;

/**
 * Message for a react-hook-form field error. Zod schemas store i18n keys
 * (`errors.*`) as messages; those are translated with the caller's namespace.
 */
export const getFieldError = <Ns extends Namespace>(
  error: FieldError | undefined,
  t: TFunction<Ns>,
): string | undefined => {
  if (!error?.message) {
    return undefined;
  }
  return error.message.startsWith('errors.') || error.message.startsWith('validations.')
    ? (t as unknown as TranslateFn)(error.message)
    : error.message;
};
