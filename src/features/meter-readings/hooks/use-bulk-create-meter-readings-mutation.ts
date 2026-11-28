import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { uploadMedia } from '@/features/media/utils/upload-media';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { meterReadingApi } from '../api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '../constants/meter-reading.constants';
import { MeterType } from '../enums/meter-type.enum';
import type {
  BulkCreateMeterReadingsRequestDto,
  CreateMeterReadingRequestDto,
  UpdateMeterReadingRequestDto,
} from '../types/meter-reading.dto';

export interface BaselineReadingBatchItem {
  payload: CreateMeterReadingRequestDto;
  evidenceFile?: File | null;
}

export interface UpdateReadingBatchItem {
  readingId: string;
  currentReading: string;
  evidenceFile?: File | null;
}

export interface BulkCreateMeterReadingsVariables {
  payload?: BulkCreateMeterReadingsRequestDto;
  /** Map keyed by `${roomId}:${type}` for pending evidence files to attach after bulk creation. */
  evidenceFiles?: Record<string, File>;
  baselineItems?: BaselineReadingBatchItem[];
  updateItems?: UpdateReadingBatchItem[];
}

const uploadEvidence = async (readingId: string, file: File): Promise<string> => {
  const media = await uploadMedia({
    file,
    ownerType: MediaOwnerType.METER_READING,
    ownerId: readingId,
    purpose: MediaPurpose.METER_READING_EVIDENCE,
    skipSuccessToast: true,
  });
  return media.id;
};

const uploadAndAttachEvidence = async (readingId: string, file: File) => {
  const mediaId = await uploadEvidence(readingId, file);
  await meterReadingApi.attachEvidence(readingId, [mediaId]);
};

export const useBulkCreateMeterReadingsMutation = (
  options?: MutationHookOptions<void, BulkCreateMeterReadingsVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      evidenceFiles,
      baselineItems = [],
      updateItems = [],
    }: BulkCreateMeterReadingsVariables) => {
      let hasShownSuccessToast = false;

      if (payload && payload.readings.length > 0) {
        const response = await meterReadingApi.bulkCreateMeterReadings(payload);
        hasShownSuccessToast = true;

        if (evidenceFiles && Object.keys(evidenceFiles).length > 0) {
          const uploads: Promise<void>[] = [];
          for (const item of response.results) {
            const elecFile = evidenceFiles[`${item.roomId}:${MeterType.ELECTRICITY}`];
            if (item.electricityReadingId && elecFile) {
              uploads.push(uploadAndAttachEvidence(item.electricityReadingId, elecFile));
            }
            const waterFile = evidenceFiles[`${item.roomId}:${MeterType.WATER}`];
            if (item.waterReadingId && waterFile) {
              uploads.push(uploadAndAttachEvidence(item.waterReadingId, waterFile));
            }
          }
          await Promise.all(uploads);
        }
      }

      for (const item of baselineItems) {
        const reading = await meterReadingApi.createMeterReading(item.payload, {
          skipSuccessToast: hasShownSuccessToast,
        });
        hasShownSuccessToast = true;
        if (item.evidenceFile) {
          await uploadAndAttachEvidence(reading.id, item.evidenceFile);
        }
      }

      for (const item of updateItems) {
        const updatePayload: UpdateMeterReadingRequestDto = {
          currentReading: item.currentReading,
        };
        if (item.evidenceFile) {
          updatePayload.evidenceMediaId = await uploadEvidence(item.readingId, item.evidenceFile);
        }
        await meterReadingApi.updateMeterReading(item.readingId, updatePayload, {
          skipSuccessToast: hasShownSuccessToast,
        });
        hasShownSuccessToast = true;
      }
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
