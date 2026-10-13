import { describe, it, expect } from 'vitest';
import { cn, formatVnd, formatDate, formatDateTime, formatMonth } from '@/lib/utils';

describe('Core Utilities (fe/src/lib/utils.ts)', () => {
  describe('cn()', () => {
    it('should merge classes and resolve Tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'bg-blue-500')).toBe('px-2 py-1 bg-blue-500');
      expect(cn('p-4', 'p-2')).toBe('p-2');
      const isHidden = false;
      const isBlue = true;
      expect(cn('text-red-500', isHidden && 'hidden', isBlue && 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatVnd()', () => {
    it('should format numbers according to mobile specification', () => {
      expect(formatVnd(1500000)).toBe('1.500.000 đ');
      expect(formatVnd(0)).toBe('0 đ');
      expect(formatVnd(50000)).toBe('50000 đ'.replace('50000', '50.000'));
      expect(formatVnd('2000000')).toBe('2.000.000 đ');
    });

    it('should safely handle null, undefined, NaN, and negative amounts', () => {
      expect(formatVnd(null)).toBe('0 đ');
      expect(formatVnd(undefined)).toBe('0 đ');
      expect(formatVnd(NaN)).toBe('0 đ');
      expect(formatVnd('invalid')).toBe('0 đ');
      expect(formatVnd(-1500000)).toBe('-1.500.000 đ');
    });
  });

  describe('Date formatters', () => {
    it('formatDate() should format to dd/MM/yyyy', () => {
      expect(formatDate('2026-10-13')).toBe('13/10/2026');
      expect(formatDate('2026-05-09T14:30:00Z')).toBe('09/05/2026');
      expect(formatDate(null)).toBe('');
      expect(formatDate('not-a-date')).toBe('not-a-date');
    });

    it('formatDateTime() should format to dd/MM/yyyy HH:mm', () => {
      const formatted = formatDateTime('2026-10-13T15:30:00');
      expect(formatted).toBe('13/10/2026 15:30');
      expect(formatDateTime(null)).toBe('');
      expect(formatDateTime('not-a-date')).toBe('not-a-date');
    });

    it('formatMonth() should format to MM/yyyy', () => {
      expect(formatMonth('2026-10')).toBe('10/2026');
      expect(formatMonth('2026-04-15')).toBe('04/2026');
      expect(formatMonth(null)).toBe('');
      expect(formatMonth('not-a-date')).toBe('not-a-date');
    });
  });
});