import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  BulkCreateMeterReadingsRequestDto,
  BulkMeterReadingResponseDto,
  CreateMeterReadingRequestDto,
  MeterReadingDto,
  MeterReadingFilter,
  UpdateMeterReadingRequestDto,
} from '../types/meter-reading.dto';

export const meterReadingApi = {
  getMeterReadings: (params?: ListParams<MeterReadingFilter>): Promise<Paginated<MeterReadingDto>> =>
    http.getPage<MeterReadingDto, MeterReadingFilter>('/meter-readings', params),

  createMeterReading: (
    payload: CreateMeterReadingRequestDto,
    options?: { skipSuccessToast?: boolean },
  ): Promise<MeterReadingDto> => http.post<MeterReadingDto>('/meter-readings', payload, options),

  bulkCreateMeterReadings: (payload: BulkCreateMeterReadingsRequestDto): Promise<BulkMeterReadingResponseDto> =>
    http.post<BulkMeterReadingResponseDto>('/meter-readings/bulk', payload),

  attachEvidence: (readingId: string, evidenceMediaIds: string[]): Promise<MeterReadingDto> =>
    http.patch<MeterReadingDto>(
      `/meter-readings/${readingId}/evidence`,
      { evidenceMediaIds },
      { skipSuccessToast: true },
    ),

  updateMeterReading: (
    id: string,
    payload: UpdateMeterReadingRequestDto,
    options?: { skipSuccessToast?: boolean },
  ): Promise<MeterReadingDto> => http.patch<MeterReadingDto>(`/meter-readings/${id}`, payload, options),
};
