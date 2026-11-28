import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { uploadMedia } from '@/features/media/utils/upload-media';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import type { MeterReadingDto, UpdateMeterReadingRequestDto } from '../types/meter-reading.dto';

export interface UpdateMeterReadingVariables {
  readingId: string;
  currentReading?: string;
  evidenceFile?: File | null;
}

export const useUpdateMeterReadingMutation = (
  options?: MutationHookOptions<MeterReadingDto, UpdateMeterReadingVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ readingId, currentReading, evidenceFile }: UpdateMeterReadingVariables) => {
      const payload: UpdateMeterReadingRequestDto = {};
      if (currentReading !== undefined) {
        payload.currentReading = currentReading;
      }

      if (evidenceFile) {
        const media = await uploadMedia({
          file: evidenceFile,
          ownerType: MediaOwnerType.METER_READING,
          ownerId: readingId,
          purpose: MediaPurpose.METER_READING_EVIDENCE,
          skipSuccessToast: true,
        });
        payload.evidenceMediaId = media.id;
      }

      return meterReadingApi.updateMeterReading(readingId, payload);
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
