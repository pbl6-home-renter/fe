import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { uploadMedia } from '@/features/media/utils/upload-media';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import type { CreateMeterReadingRequestDto, MeterReadingDto } from '../types/meter-reading.dto';

export interface CreateMeterReadingVariables {
  payload: CreateMeterReadingRequestDto;
  evidenceFile?: File | null;
}

export const useCreateMeterReadingMutation = (
  options?: MutationHookOptions<MeterReadingDto, CreateMeterReadingVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, evidenceFile }: CreateMeterReadingVariables) => {
      const reading = await meterReadingApi.createMeterReading(payload);
      if (evidenceFile) {
        const media = await uploadMedia({
          file: evidenceFile,
          ownerType: MediaOwnerType.METER_READING,
          ownerId: reading.id,
          purpose: MediaPurpose.METER_READING_EVIDENCE,
          skipSuccessToast: true,
        });
        return meterReadingApi.attachEvidence(reading.id, [media.id]);
      }
      return reading;
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: METER_READING_QUERY_KEYS.ALL,
      });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
