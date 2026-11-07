import type { ListParams } from '@/types/api';
import type { MeterReadingFilter } from '../types/meter-reading.dto';

export const METER_READING_QUERY_KEYS = {
  ALL: ['meter-readings'] as const,
  LISTS: () => [...METER_READING_QUERY_KEYS.ALL, 'list'] as const,
  LIST: (params?: ListParams<MeterReadingFilter>) => [...METER_READING_QUERY_KEYS.LISTS(), params] as const,
  DETAIL: (id: string) => [...METER_READING_QUERY_KEYS.ALL, 'detail', id] as const,
};

export const METER_READING_PATTERNS = {
  PERIOD: /^\d{4}-(0[1-9]|1[0-2])$/,
  DECIMAL: /^(0|[1-9]\d*)(\.\d+)?$/,
};
