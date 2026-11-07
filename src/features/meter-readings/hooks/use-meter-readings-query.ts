import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import type { MeterReadingDto, MeterReadingFilter } from '../types/meter-reading.dto';

export const useMeterReadingsQuery = (
  params?: ListParams<MeterReadingFilter>,
  options?: QueryHookOptions<Paginated<MeterReadingDto>> | boolean,
) => {
  const queryOptions = typeof options === 'boolean' ? { enabled: options } : options;

  return useQuery<Paginated<MeterReadingDto>>({
    queryKey: METER_READING_QUERY_KEYS.LIST(params),
    queryFn: () => meterReadingApi.getMeterReadings(params),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};
