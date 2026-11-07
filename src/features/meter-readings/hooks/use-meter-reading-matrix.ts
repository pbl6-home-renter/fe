import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { useMyRoomsQuery } from '@/features/rooms/hooks/use-my-rooms-query';
import { useMeterReadingsQuery } from './use-meter-readings-query';
import { useBulkCreateMeterReadingsMutation } from './use-bulk-create-meter-readings-mutation';
import { getCurrentPeriod, getPreviousPeriod } from '../utils/meter-reading.helper';
import { MeterType } from '../enums/meter-type.enum';
import { buildMatrixState, type UserEditsMap } from '../utils/matrix-state.helper';
import type { BulkMeterReadingItemRequestDto } from '../types/meter-reading.dto';

export const useMeterReadingMatrix = () => {
  const { t } = useTranslation('meterReadings');
  const notify = useNotify();
  const [searchParams, setSearchParams] = useSearchParams();

  const [userEdits, setUserEdits] = useState<UserEditsMap>({});

  const { data: buildingsData, isLoading: isLoadingBuildings } = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = useMemo(() => buildingsData?.items ?? [], [buildingsData?.items]);

  const selectedPeriod = searchParams.get('period') || getCurrentPeriod();
  const selectedBuildingId = searchParams.get('buildingId') || buildings[0]?.id || '';
  const previousPeriod = useMemo(() => getPreviousPeriod(selectedPeriod), [selectedPeriod]);

  const { data: roomsData, isLoading: isLoadingRooms } = useMyRoomsQuery(
    { filter: { buildingId: selectedBuildingId }, pageSize: 100 },
    Boolean(selectedBuildingId),
  );
  const rooms = useMemo(() => roomsData?.items ?? [], [roomsData?.items]);

  const { data: currentReadingsData, isLoading: isLoadingCurrent } = useMeterReadingsQuery(
    { filter: { period: selectedPeriod }, pageSize: 100 },
    { enabled: Boolean(selectedBuildingId && selectedPeriod) },
  );

  const { data: prevReadingsData } = useMeterReadingsQuery(
    { filter: { period: previousPeriod }, pageSize: 100 },
    { enabled: Boolean(selectedBuildingId && previousPeriod) },
  );

  const matrixState = useMemo(() => {
    return buildMatrixState(rooms, currentReadingsData?.items ?? [], prevReadingsData?.items ?? [], userEdits);
  }, [rooms, currentReadingsData?.items, prevReadingsData?.items, userEdits]);

  const handleBuildingChange = useCallback(
    (id: string) => {
      setUserEdits({});
      setSearchParams({ buildingId: id, period: selectedPeriod }, { replace: true });
    },
    [selectedPeriod, setSearchParams],
  );

  const handlePeriodChange = useCallback(
    (period: string) => {
      setUserEdits({});
      setSearchParams({ buildingId: selectedBuildingId, period }, { replace: true });
    },
    [selectedBuildingId, setSearchParams],
  );

  const handleReadingChange = useCallback((roomId: string, type: MeterType, value: string) => {
    setUserEdits((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [type]: {
          ...prev[roomId]?.[type],
          currentReading: value,
          error: undefined,
        },
      },
    }));
  }, []);

  const handleCellOcrSuccess = useCallback(
    (
      roomId: string,
      type: MeterType,
      data: {
        currentReading?: string;
        evidenceMediaId: string;
        previewUrl: string;
        source: 'manual' | 'ocr';
        ocrValue?: string | null;
        ocrConfidence?: number;
      },
    ) => {
      setUserEdits((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [type]: {
            ...prev[roomId]?.[type],
            currentReading: data.currentReading ?? prev[roomId]?.[type]?.currentReading,
            evidenceMediaId: data.evidenceMediaId,
            evidencePreviewUrl: data.previewUrl,
            source: data.source,
            ocrValue: data.ocrValue,
            ocrConfidence: data.ocrConfidence,
            error: undefined,
          },
        },
      }));
    },
    [],
  );

  const bulkCreateMutation = useBulkCreateMeterReadingsMutation({
    onSuccess: () => {
      setUserEdits({});
    },
  });

  const handleSaveBulk = useCallback(() => {
    const payloadItems: BulkMeterReadingItemRequestDto[] = [];
    for (const row of Object.values(matrixState)) {
      if (row.electricity.currentReading.trim() && !row.electricity.isSaved) {
        if (!row.electricity.evidenceMediaId) {
          notify.error(t('errors.missingPhotoForRoom', { room: row.roomName, type: t('types.electricity') }));
          return;
        }
        payloadItems.push({
          roomId: row.roomId,
          type: MeterType.ELECTRICITY,
          currentReading: row.electricity.currentReading.trim(),
          evidenceMediaId: row.electricity.evidenceMediaId,
        });
      }
      if (row.water.currentReading.trim() && !row.water.isSaved) {
        if (!row.water.evidenceMediaId) {
          notify.error(t('errors.missingPhotoForRoom', { room: row.roomName, type: t('types.water') }));
          return;
        }
        payloadItems.push({
          roomId: row.roomId,
          type: MeterType.WATER,
          currentReading: row.water.currentReading.trim(),
          evidenceMediaId: row.water.evidenceMediaId,
        });
      }
    }

    if (payloadItems.length === 0) {
      notify.info(t('warnings.noUnsavedChanges'));
      return;
    }

    bulkCreateMutation.mutate({
      buildingId: selectedBuildingId,
      recordedMonth: selectedPeriod,
      readings: payloadItems,
    });
  }, [matrixState, selectedBuildingId, selectedPeriod, bulkCreateMutation, notify, t]);

  const rows = useMemo(() => Object.values(matrixState), [matrixState]);

  return {
    buildings,
    selectedBuildingId,
    selectedPeriod,
    rows,
    isLoading: isLoadingBuildings || isLoadingRooms || isLoadingCurrent,
    isSaving: bulkCreateMutation.isPending,
    handleBuildingChange,
    handlePeriodChange,
    handleReadingChange,
    handleCellOcrSuccess,
    handleSaveBulk,
  };
};
