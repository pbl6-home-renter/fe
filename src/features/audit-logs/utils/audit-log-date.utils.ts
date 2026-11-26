const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates a 'YYYY-MM-DD' date string against a real calendar date.
 */
export const isValidDateInput = (value: string | null | undefined): value is string => {
  if (!value || !DATE_INPUT_REGEX.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/**
 * Returns true when both dates are valid 'YYYY-MM-DD' strings and `from > to`.
 */
export const isDateRangeInvalid = (fromDate: string, toDate: string): boolean => {
  if (!isValidDateInput(fromDate) || !isValidDateInput(toDate)) return false;
  return fromDate > toDate;
};

/**
 * Converts a local 'YYYY-MM-DD' string to an ISO-8601 UTC string representing local start of day.
 */
export const toStartOfDayIso = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
};

/**
 * Converts a local 'YYYY-MM-DD' string to an ISO-8601 UTC string representing local end of day.
 */
export const toEndOfDayIso = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
};
