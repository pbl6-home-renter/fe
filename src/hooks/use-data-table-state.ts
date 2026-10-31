import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';

const PAGE_SIZES = [10, 20, 50, 100] as const;
const EMPTY_FILTERS: Record<string, string> = {};
const EMPTY_PINNING: ColumnPinningState = { left: [], right: [] };
const EMPTY_IDS: string[] = [];

interface StoredPreferences {
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: ColumnSizingState;
  density: DataTableDensity;
}

interface UseDataTableStateOptions {
  tableId: string;
  columnIds: string[];
  allowedSorts: string[];
  defaultPageSize?: number;
  defaultSort?: { id: string; desc: boolean };
  defaultFilters?: Record<string, string>;
  defaultColumnPinning?: ColumnPinningState;
  requiredColumnIds?: string[];
}

const applyUpdater = <T,>(updater: Updater<T>, current: T): T =>
  typeof updater === 'function'
    ? (updater as (value: T) => T)(current)
    : updater;

const readPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const readPreferences = (
  tableId: string,
  columnIds: string[],
  defaultColumnPinning: ColumnPinningState,
  requiredColumnIds: string[],
): StoredPreferences => {
  const defaults: StoredPreferences = {
    columnVisibility: {},
    columnOrder: columnIds,
    columnPinning: defaultColumnPinning,
    columnSizing: {},
    density: 'standard',
  };

  try {
    const raw = window.localStorage.getItem(`rentify:data-table:${tableId}:v2`);
    if (!raw) return defaults;
    const stored = JSON.parse(raw) as Partial<StoredPreferences>;
    const validIds = new Set(columnIds);
    const order = (stored.columnOrder ?? []).filter((id) => validIds.has(id));
    const missing = columnIds.filter((id) => !order.includes(id));
    const visibility: VisibilityState = Object.fromEntries(
      Object.entries(stored.columnVisibility ?? {}).filter(([id]) => validIds.has(id)),
    );
    const pinning = {
      left: (stored.columnPinning?.left ?? []).filter((id) => validIds.has(id)),
      right: (stored.columnPinning?.right ?? []).filter((id) => validIds.has(id)),
    };
    requiredColumnIds.forEach((id) => { visibility[id] = true; });
    [...pinning.left, ...pinning.right].forEach((id) => { visibility[id] = true; });
    const sizing = Object.fromEntries(
      Object.entries(stored.columnSizing ?? {}).filter(([id]) => validIds.has(id)),
    );
    const density = ['compact', 'standard', 'comfortable'].includes(stored.density ?? '')
      ? stored.density as DataTableDensity
      : 'standard';

    return {
      columnVisibility: visibility,
      columnOrder: [...order, ...missing],
      columnPinning: pinning,
      columnSizing: sizing,
      density,
    };
  } catch {
    return defaults;
  }
};

export const useDataTableState = ({
  tableId,
  columnIds,
  allowedSorts,
  defaultPageSize = 10,
  defaultSort,
  defaultFilters = EMPTY_FILTERS,
  defaultColumnPinning = EMPTY_PINNING,
  requiredColumnIds = EMPTY_IDS,
}: UseDataTableStateOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [preferences, setPreferences] = useState<StoredPreferences>(() =>
    readPreferences(tableId, columnIds, defaultColumnPinning, requiredColumnIds),
  );

  const rawPageSize = readPositiveInt(searchParams.get('pageSize'), defaultPageSize);
  const pageSize = PAGE_SIZES.includes(rawPageSize as (typeof PAGE_SIZES)[number])
    ? rawPageSize
    : defaultPageSize;
  const pageNo = readPositiveInt(searchParams.get('page'), 1);
  const sortParam = searchParams.get('sort');
  const sortId = sortParam && allowedSorts.includes(sortParam)
    ? sortParam
    : defaultSort?.id;
  const orderParam = searchParams.get('order');
  const sortDesc = orderParam === 'asc' || orderParam === 'desc'
    ? orderParam === 'desc'
    : defaultSort?.desc ?? false;

  const sorting = useMemo<SortingState>(
    () => sortId ? [{ id: sortId, desc: sortDesc }] : [],
    [sortDesc, sortId],
  );
  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex: pageNo - 1, pageSize }),
    [pageNo, pageSize],
  );

  const updateUrl = useCallback((updates: Record<string, string | undefined>, replace = false) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      return next;
    }, { replace });
  }, [setSearchParams]);

  const onPaginationChange = useCallback((updater: Updater<PaginationState>) => {
    const next = applyUpdater(updater, pagination);
    const pageSizeChanged = next.pageSize !== pagination.pageSize;
    setRowSelection({});
    updateUrl({
      page: String(pageSizeChanged ? 1 : next.pageIndex + 1),
      pageSize: String(next.pageSize),
    });
  }, [pagination, updateUrl]);

  const onSortingChange = useCallback((updater: Updater<SortingState>) => {
    const next = applyUpdater(updater, sorting).slice(0, 1);
    setRowSelection({});
    updateUrl({
      page: '1',
      sort: next[0]?.id,
      order: next[0] ? (next[0].desc ? 'desc' : 'asc') : undefined,
    });
  }, [sorting, updateUrl]);

  const updatePreference = useCallback(<K extends keyof StoredPreferences>(
    key: K,
    updater: Updater<StoredPreferences[K]>,
  ) => {
    setPreferences((current) => ({
      ...current,
      [key]: applyUpdater(updater, current[key]),
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      `rentify:data-table:${tableId}:v2`,
      JSON.stringify(preferences),
    );
  }, [preferences, tableId]);

  const setSearch = useCallback((value: string) => {
    setRowSelection({});
    updateUrl({ page: '1', q: value || undefined }, true);
  }, [updateUrl]);

  const setFilter = useCallback((key: string, value?: string) => {
    setRowSelection({});
    updateUrl({ page: '1', [key]: value });
  }, [updateUrl]);

  const clearFilters = useCallback(() => {
    const updates: Record<string, undefined> = { page: undefined, q: undefined };
    Object.keys(defaultFilters).forEach((key) => { updates[key] = undefined; });
    setRowSelection({});
    updateUrl(updates);
  }, [defaultFilters, updateUrl]);

  const state = useMemo<DataTableControlledState>(() => ({
    pagination,
    sorting,
    rowSelection,
    columnVisibility: preferences.columnVisibility,
    columnOrder: preferences.columnOrder,
    columnPinning: preferences.columnPinning,
    columnSizing: preferences.columnSizing,
    density: preferences.density,
  }), [pagination, preferences, rowSelection, sorting]);

  const handlers = useMemo<DataTableStateHandlers>(() => ({
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => setPreferences((current) => {
      const columnVisibility = {
        ...applyUpdater(updater, current.columnVisibility),
      };
      const protectedIds = new Set([
        ...requiredColumnIds,
        ...(current.columnPinning.left ?? []),
        ...(current.columnPinning.right ?? []),
      ]);
      protectedIds.forEach((id) => { columnVisibility[id] = true; });
      return { ...current, columnVisibility };
    }),
    onColumnOrderChange: (updater) => updatePreference('columnOrder', updater),
    onColumnPinningChange: (updater) => setPreferences((current) => {
      const columnPinning = applyUpdater(updater, current.columnPinning);
      const columnVisibility = { ...current.columnVisibility };
      [...(columnPinning.left ?? []), ...(columnPinning.right ?? [])]
        .forEach((id) => { columnVisibility[id] = true; });
      return { ...current, columnPinning, columnVisibility };
    }),
    onColumnSizingChange: (updater) => updatePreference('columnSizing', updater),
  }), [onPaginationChange, onSortingChange, requiredColumnIds, updatePreference]);

  const filters = useMemo(
    () => Object.fromEntries(
      Object.entries(defaultFilters).map(([key, fallback]) => [key, searchParams.get(key) ?? fallback]),
    ),
    [defaultFilters, searchParams],
  );

  const setDensity = useCallback((density: DataTableDensity) =>
    setPreferences((current) => ({ ...current, density })), []);

  return {
    state,
    handlers,
    pageNo,
    pageSize,
    search: searchParams.get('q') ?? '',
    filters,
    setSearch,
    setFilter,
    clearFilters,
    setDensity,
  };
};

