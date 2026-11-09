import type { BaseEntity } from '@/types/api';
import type { MeterType } from '../enums/meter-type.enum';

export interface MeterReadingDto extends BaseEntity {
  roomId: string;
  buildingId: string;
  type: MeterType;
  period: string; // YYYY-MM
  previousReading: string;
  currentReading: string;
  consumption: string;
  isBaseline: boolean;
  evidenceMediaId: string | null;
}

export interface MeterReadingFilter {
  roomId?: string;
  type?: MeterType;
  period?: string; // YYYY-MM
}

export interface CreateMeterReadingRequestDto {
  roomId: string;
  type: MeterType;
  period: string;
  currentReading: string;
  previousReading?: string;
  isBaseline: boolean;
  evidenceMediaId: string;
}

export interface BulkMeterReadingItemRequestDto {
  roomId: string;
  type: MeterType;
  currentReading: string;
  evidenceMediaId: string;
}

export interface BulkCreateMeterReadingsRequestDto {
  buildingId: string;
  recordedMonth: string;
  readings: BulkMeterReadingItemRequestDto[];
}

export interface BulkRoomReadingResponseDto {
  roomId: string;
  roomName: string;
  electricityReadingId: string | null;
  electricityUsage: string | null;
  waterReadingId: string | null;
  waterUsage: string | null;
  status: 'SUCCESS';
  note: string | null;
}

export interface BulkMeterReadingResponseDto {
  buildingId: string;
  buildingName: string;
  recordedMonth: string;
  totalRoomsRecorded: number;
  totalElectricityUsage: string;
  totalWaterUsage: string;
  results: BulkRoomReadingResponseDto[];
}

export interface UpdateMeterReadingRequestDto {
  currentReading?: string;
  evidenceMediaId?: string;
}

export interface AiMeterReadingOcrResponseDto {
  value: string | null;
  confidence: number;
}

export interface MeterCellState {
  existingId: string | null;
  previousReading: string;
  currentReading: string;
  consumption: string;
  evidenceMediaId: string | null;
  evidencePreviewUrl: string | null;
  source: 'manual' | 'ocr';
  ocrValue?: string | null;
  ocrConfidence?: number;
  isUploading: boolean;
  isSaved: boolean;
  error?: string;
}

/** Client UI Matrix state for each room in a building */
export interface RoomReadingRowState {
  roomId: string;
  roomName: string;
  hasActiveContract: boolean;
  electricity: MeterCellState;
  water: MeterCellState;
}
