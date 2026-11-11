import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  AiMeterReadingOcrResponseDto,
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

  createMeterReading: (payload: CreateMeterReadingRequestDto): Promise<MeterReadingDto> =>
    http.post<MeterReadingDto>('/meter-readings', payload),

  bulkCreateMeterReadings: (payload: BulkCreateMeterReadingsRequestDto): Promise<BulkMeterReadingResponseDto> =>
    http.post<BulkMeterReadingResponseDto>('/meter-readings/bulk', payload),

  updateMeterReading: (id: string, payload: UpdateMeterReadingRequestDto): Promise<MeterReadingDto> =>
    http.patch<MeterReadingDto>(`/meter-readings/${id}`, payload),

  /**
   * AI OCR recognizing numbers on electric/water meters.
   * If service is unavailable, timed out or errors, gracefully falls back to null.
   */
  ocrMeterReading: async (file: File, signal?: AbortSignal): Promise<AiMeterReadingOcrResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await http.post<AiMeterReadingOcrResponseDto>('/ai/meter-readings/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000,
        signal,
        skipErrorToast: true,
      });
      return response ?? { value: null, confidence: 0 };
    } catch {
      // Graceful fallback to manual entry when AI OCR is unreachable or returns error
      return { value: null, confidence: 0 };
    }
  },
};
