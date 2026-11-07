import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import type { CreateMeterReadingRequestDto, MeterReadingDto } from '../types/meter-reading.dto';

export const useCreateMeterReadingMutation = (
  options?: MutationHookOptions<MeterReadingDto, CreateMeterReadingRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeterReadingRequestDto) => meterReadingApi.createMeterReading(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: METER_READING_QUERY_KEYS.ALL,
      });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
