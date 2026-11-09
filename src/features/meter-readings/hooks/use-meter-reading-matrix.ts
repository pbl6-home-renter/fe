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
  const [internalBuildingId, setInternalBuildingId] = useState<string>('');
  const [internalPeriod, setInternalPeriod] = useState<string>('');

  const { data: buildingsData, isLoading: isLoadingBuildings } = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = useMemo(() => buildingsData?.items ?? [], [buildingsData?.items]);

  const selectedBuildingId = searchParams.get('buildingId') || internalBuildingId || buildings[0]?.id || '';
  const selectedPeriod = searchParams.get('period') || internalPeriod || getCurrentPeriod();
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
      setInternalBuildingId(id);
      setUserEdits({});
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('buildingId', id);
          next.set('period', selectedPeriod);
          next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [selectedPeriod, setSearchParams],
  );

  const handlePeriodChange = useCallback(
    (period: string) => {
      setInternalPeriod(period);
      setUserEdits({});
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (selectedBuildingId) next.set('buildingId', selectedBuildingId);
          next.set('period', period);
          return next;
        },
        { replace: true },
      );
    },
    [selectedBuildingId, setSearchParams],
  );

  const handleReadingChange = useCallback((roomId: string, type: MeterType, value: string) => {
    setUserEdits((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [type]: { ...prev[roomId]?.[type], currentReading: value, error: undefined },
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
    const types = [
      { key: 'electricity' as const, type: MeterType.ELECTRICITY },
      { key: 'water' as const, type: MeterType.WATER },
    ];
    for (const row of Object.values(matrixState)) {
      for (const { key, type } of types) {
        const cell = row[key];
        if (cell.currentReading.trim() && !cell.isSaved) {
          if (!cell.evidenceMediaId) {
            notify.error(t('errors.missingPhotoForRoom', { room: row.roomName, type: t(`types.${key}`) }));
            return;
          }
          payloadItems.push({
            roomId: row.roomId,
            type,
            currentReading: cell.currentReading.trim(),
            evidenceMediaId: cell.evidenceMediaId,
          });
        }
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
