import { MeterType } from '../enums/meter-type.enum';
import { calculateConsumption } from './meter-reading.helper';
import type { MeterReadingDto, RoomReadingRowState, MeterCellState } from '../types/meter-reading.dto';

interface RoomItem {
  id: string;
  name: string;
}

export type UserEditsMap = Record<string, Partial<Record<MeterType, Partial<MeterCellState>>>>;

const resolveCell = (
  currentServer?: MeterReadingDto,
  prevServer?: MeterReadingDto,
  edit?: Partial<MeterCellState>,
): MeterCellState => {
  const previousReading = currentServer?.previousReading || prevServer?.currentReading || '0';
  const currentReading = edit?.currentReading !== undefined ? edit.currentReading : currentServer?.currentReading || '';

  const evidenceMediaId =
    edit?.evidenceMediaId !== undefined ? edit.evidenceMediaId : currentServer?.evidenceMediaId || null;

  const evidencePreviewUrl = edit?.evidencePreviewUrl !== undefined ? edit.evidencePreviewUrl : null;

  const isSaved = Boolean(currentServer?.id) && edit?.currentReading === undefined;

  return {
    existingId: currentServer?.id || null,
    previousReading,
    currentReading,
    consumption: calculateConsumption(currentReading, previousReading),
    evidenceMediaId,
    evidencePreviewUrl,
    source: edit?.source || (currentServer?.id ? 'manual' : 'manual'),
    ocrValue: edit?.ocrValue,
    ocrConfidence: edit?.ocrConfidence,
    isUploading: edit?.isUploading || false,
    isSaved,
    error: edit?.error,
  };
};

export const buildMatrixState = (
  rooms: RoomItem[],
  currentReadings: MeterReadingDto[],
  previousReadings: MeterReadingDto[],
  userEdits: UserEditsMap,
): Record<string, RoomReadingRowState> => {
  const currentMap = new Map<string, MeterReadingDto>();
  currentReadings.forEach((r) => currentMap.set(`${r.roomId}:${r.type}`, r));

  const prevMap = new Map<string, MeterReadingDto>();
  previousReadings.forEach((r) => prevMap.set(`${r.roomId}:${r.type}`, r));

  const next: Record<string, RoomReadingRowState> = {};
  for (const room of rooms) {
    const electCurr = currentMap.get(`${room.id}:${MeterType.ELECTRICITY}`);
    const electPrev = prevMap.get(`${room.id}:${MeterType.ELECTRICITY}`);
    const waterCurr = currentMap.get(`${room.id}:${MeterType.WATER}`);
    const waterPrev = prevMap.get(`${room.id}:${MeterType.WATER}`);

    const roomEdits = userEdits[room.id];

    next[room.id] = {
      roomId: room.id,
      roomName: room.name,
      hasActiveContract: true,
      electricity: resolveCell(electCurr, electPrev, roomEdits?.[MeterType.ELECTRICITY]),
      water: resolveCell(waterCurr, waterPrev, roomEdits?.[MeterType.WATER]),
    };
  }
  return next;
};
