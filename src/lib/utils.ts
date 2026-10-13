import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind and conditional class names safely without class duplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric value as VND currency ('#,##0 đ').
 * Gracefully handles null, undefined, NaN, empty strings, and negative values.
 * Examples:
 * - 1500000 -> '1.500.000 đ'
 * - 0 -> '0 đ'
 * - null / undefined / NaN -> '0 đ'
 */
export function formatVnd(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '0 đ';
  }

  const numericValue = typeof amount === 'number' ? amount : Number(amount);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return '0 đ';
  }

  const rounded = Math.round(numericValue);
  const isNegative = rounded < 0;
  const absString = Math.abs(rounded).toString();

  // Add '.' thousands separators
  const formattedNumber = absString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${isNegative ? '-' : ''}${formattedNumber} đ`;
}

/**
 * Parses an ISO string or date-compatible string into a Date object.
 * Returns null if the string is empty or invalid.
 */
function parseDateInput(isoString: string | null | undefined): Date | null {
  if (!isoString || typeof isoString !== 'string') {
    return null;
  }

  const trimmed = isoString.trim();
  if (!trimmed) {
    return null;
  }

  // Handle year-month format 'yyyy-MM'
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [year, month] = trimmed.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Handle date format 'yyyy-MM-dd' without time zone skew
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Pads a single-digit number with a leading zero.
 */
function padZero(value: number): string {
  return value.toString().padStart(2, '0');
}

/**
 * Formats an ISO date string as 'dd/MM/yyyy'.
 * Returns the original string if invalid or blank.
 * Example: '2026-10-13T09:00:00Z' -> '13/10/2026'
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }

  const date = parseDateInput(isoString);
  if (!date) {
    return isoString;
  }

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats an ISO date-time string as 'dd/MM/yyyy HH:mm'.
 * Returns the original string if invalid or blank.
 * Example: '2026-10-13T09:05:00' -> '13/10/2026 09:05'
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }

  const date = parseDateInput(isoString);
  if (!date) {
    return isoString;
  }

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formats an ISO date or year-month string as 'MM/yyyy'.
 * Returns the original string if invalid or blank.
 * Example: '2026-10' or '2026-10-13' -> '10/2026'
 */
export function formatMonth(isoString: string | null | undefined): string {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }

  const date = parseDateInput(isoString);
  if (!date) {
    return isoString;
  }

  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${month}/${year}`;
}
