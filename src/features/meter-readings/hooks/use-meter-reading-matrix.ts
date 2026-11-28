import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { useMyRoomsQuery } from '@/features/rooms/hooks/use-my-rooms-query';
import { useMeterReadingsQuery } from './use-meter-readings-query';
import {
  useBulkCreateMeterReadingsMutation,
  type BaselineReadingBatchItem,
  type UpdateReadingBatchItem,
} from './use-bulk-create-meter-readings-mutation';
import { getCurrentPeriod, getPreviousPeriod } from '../utils/meter-reading.helper';
import { MeterType } from '../enums/meter-type.enum';
import { buildMatrixState, type UserEditsMap } from '../utils/matrix-state.helper';
import type { BulkMeterReadingItemRequestDto, CellOcrSuccessData } from '../types/meter-reading.dto';

export const useMeterReadingMatrix = () => {
  const { t } = useTranslation('meterReadings');
  const notify = useNotify();
  const [searchParams, setSearchParams] = useSearchParams();

  const [userEdits, setUserEdits] = useState<UserEditsMap>({});
  const [internalBuildingId, setInternalBuildingId] = useState<string>('');
  const [internalPeriod, setInternalPeriod] = useState<string>('');

  const {
    data: buildingsData,
    isLoading: isLoadingBuildings,
    isFetching: isFetchingBuildings,
    isError: isBuildingsError,
    refetch: refetchBuildings,
  } = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = useMemo(() => buildingsData?.items ?? [], [buildingsData?.items]);

  const selectedBuildingId = searchParams.get('buildingId') || internalBuildingId || buildings[0]?.id || '';
  const selectedPeriod = searchParams.get('period') || internalPeriod || getCurrentPeriod();
  const previousPeriod = useMemo(() => getPreviousPeriod(selectedPeriod), [selectedPeriod]);

  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    isFetching: isFetchingRooms,
    isError: isRoomsError,
    isPlaceholderData: isPlaceholderRooms,
    refetch: refetchRooms,
  } = useMyRoomsQuery({ filter: { buildingId: selectedBuildingId }, pageSize: 100 }, Boolean(selectedBuildingId));
  const rooms = useMemo(() => roomsData?.items ?? [], [roomsData?.items]);

  const {
    data: currentReadingsData,
    isLoading: isLoadingCurrent,
    isFetching: isFetchingCurrent,
    isError: isCurrentError,
    isPlaceholderData: isPlaceholderCurrent,
    refetch: refetchCurrent,
  } = useMeterReadingsQuery(
    { filter: { period: selectedPeriod }, pageSize: 100 },
    { enabled: Boolean(selectedBuildingId && selectedPeriod) },
  );

  const {
    data: prevReadingsData,
    isLoading: isLoadingPrevious,
    isFetching: isFetchingPrevious,
    isError: isPreviousError,
    isPlaceholderData: isPlaceholderPrevious,
    refetch: refetchPrevious,
  } = useMeterReadingsQuery(
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

  const handleCellOcrSuccess = useCallback((roomId: string, type: MeterType, data: CellOcrSuccessData) => {
    setUserEdits((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [type]: {
          ...prev[roomId]?.[type],
          currentReading: data.currentReading ?? prev[roomId]?.[type]?.currentReading,
          evidenceMediaId: data.evidenceMediaId ?? prev[roomId]?.[type]?.evidenceMediaId ?? null,
          evidenceFile: data.evidenceFile ?? prev[roomId]?.[type]?.evidenceFile ?? null,
          evidencePreviewUrl: data.previewUrl,
          source: data.source,
          ocrValue: data.ocrValue,
          ocrConfidence: data.ocrConfidence,
          error: undefined,
        },
      },
    }));
  }, []);

  const bulkCreateMutation = useBulkCreateMeterReadingsMutation({
    onSuccess: () => {
      setUserEdits({});
    },
  });

  const clearCellEdit = useCallback((roomId: string, type: MeterType) => {
    setUserEdits((prev) => {
      const roomEdits = prev[roomId];
      if (!roomEdits?.[type]) return prev;
      const nextRoomEdits = { ...roomEdits };
      delete nextRoomEdits[type];
      return { ...prev, [roomId]: nextRoomEdits };
    });
  }, []);

  const handleSaveBulk = useCallback(() => {
    const payloadItems: BulkMeterReadingItemRequestDto[] = [];
    const evidenceFiles: Record<string, File> = {};
    const baselineItems: BaselineReadingBatchItem[] = [];
    const updateItems: UpdateReadingBatchItem[] = [];
    const types = [
      { key: 'electricity' as const, type: MeterType.ELECTRICITY },
      { key: 'water' as const, type: MeterType.WATER },
    ];
    for (const row of Object.values(matrixState)) {
      for (const { key, type } of types) {
        const cell = row[key];
        if (cell.currentReading.trim() && !cell.isSaved) {
          if (!cell.evidenceFile && !cell.evidenceMediaId) {
            notify.error(t('errors.missingPhotoForRoom', { room: row.roomName, type: t(`types.${key}`) }));
            return;
          }
          if (cell.existingId) {
            updateItems.push({
              readingId: cell.existingId,
              currentReading: cell.currentReading.trim(),
              evidenceFile: cell.evidenceFile,
            });
          } else if (!cell.hasPreviousReading) {
            baselineItems.push({
              payload: {
                roomId: row.roomId,
                type,
                period: selectedPeriod,
                currentReading: cell.currentReading.trim(),
                previousReading: '0',
                isBaseline: true,
              },
              evidenceFile: cell.evidenceFile,
            });
          } else {
            payloadItems.push({
              roomId: row.roomId,
              type,
              currentReading: cell.currentReading.trim(),
            });
            if (cell.evidenceFile) {
              evidenceFiles[`${row.roomId}:${type}`] = cell.evidenceFile;
            }
          }
        }
      }
    }

    if (payloadItems.length === 0 && baselineItems.length === 0 && updateItems.length === 0) {
      notify.info(t('warnings.noUnsavedChanges'));
      return;
    }

    bulkCreateMutation.mutate({
      payload:
        payloadItems.length > 0
          ? {
              buildingId: selectedBuildingId,
              recordedMonth: selectedPeriod,
              readings: payloadItems,
            }
          : undefined,
      evidenceFiles,
      baselineItems,
      updateItems,
    });
  }, [matrixState, selectedBuildingId, selectedPeriod, bulkCreateMutation, notify, t]);

  const rows = useMemo(() => Object.values(matrixState), [matrixState]);
  const isLoading =
    isLoadingBuildings ||
    isLoadingRooms ||
    isLoadingCurrent ||
    isLoadingPrevious ||
    isPlaceholderRooms ||
    isPlaceholderCurrent ||
    isPlaceholderPrevious;
  const isFetching = isFetchingBuildings || isFetchingRooms || isFetchingCurrent || isFetchingPrevious;
  const isError =
    (isBuildingsError && !buildingsData) ||
    (isRoomsError && !roomsData) ||
    (isCurrentError && !currentReadingsData) ||
    (isPreviousError && !prevReadingsData);

  const handleRefresh = useCallback(() => {
    void Promise.all([
      refetchBuildings(),
      ...(selectedBuildingId ? [refetchRooms(), refetchCurrent(), refetchPrevious()] : []),
    ]);
  }, [refetchBuildings, refetchRooms, refetchCurrent, refetchPrevious, selectedBuildingId]);

  return {
    buildings,
    selectedBuildingId,
    selectedPeriod,
    rows,
    isLoading,
    isFetching,
    isError,
    handleRefresh,
    isSaving: bulkCreateMutation.isPending,
    handleBuildingChange,
    handlePeriodChange,
    handleReadingChange,
    handleCellOcrSuccess,
    handleSaveBulk,
    clearCellEdit,
  };
};
