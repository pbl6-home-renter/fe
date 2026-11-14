import { useQuery } from '@tanstack/react-query';
import { meterReadingApi } from '@/features/meter-readings/api/meter-reading.api';
import { METER_READING_QUERY_KEYS } from '@/features/meter-readings/constants/meter-reading.constants';
import type { MeterType } from '@/features/meter-readings/enums/meter-type.enum';
import type { MeterReadingDto } from '@/features/meter-readings/types/meter-reading.dto';

const compareReadings = (a: MeterReadingDto, b: MeterReadingDto) =>
  b.period.localeCompare(a.period) || Number(a.isBaseline) - Number(b.isBaseline) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

export const useRoomLatestMeterReading = (roomId: string, type: MeterType) => {
  const filter = { roomId, type };

  return useQuery({
    queryKey: [...METER_READING_QUERY_KEYS.LISTS(), 'room-latest', filter],
    placeholderData: undefined,
    queryFn: async () => {
      let pageNo = 1;
      let latest: MeterReadingDto | null = null;
      while (true) {
        const { items, pagination } = await meterReadingApi.getMeterReadings({ pageNo, filter });
        if (!pagination || pagination.pageNo !== pageNo || !Number.isInteger(pagination.totalPages)
          || pagination.totalPages < 0 || typeof pagination.hasNextPage !== 'boolean'
          || pagination.hasNextPage !== (pageNo < pagination.totalPages)
          || (pagination.hasNextPage && items.length === 0)) {
          throw new Error('Incomplete meter readings pagination');
        }
        for (const reading of items) {
          if (!latest || compareReadings(reading, latest) < 0) latest = reading;
        }
        if (!pagination.hasNextPage) return latest;
        pageNo += 1;
      }
    },
  });
};
