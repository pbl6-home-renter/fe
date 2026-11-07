import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import type { BulkCreateMeterReadingsRequestDto, BulkMeterReadingResponseDto } from '../types/meter-reading.dto';

export const useBulkCreateMeterReadingsMutation = (
  options?: MutationHookOptions<BulkMeterReadingResponseDto, BulkCreateMeterReadingsRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkCreateMeterReadingsRequestDto) => meterReadingApi.bulkCreateMeterReadings(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: METER_READING_QUERY_KEYS.ALL,
      });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
