import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import type {
  DataTableControlledState,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';

interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  rowCount?: number;
  mode: 'client' | 'server';
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  features?: {
    selection?: boolean;
    columnVisibility?: boolean;
    columnOrder?: boolean;
    columnResize?: boolean;
    columnPinning?: boolean;
  };
}

export const useDataTable = <TData,>({
  data,
  columns,
  getRowId,
  rowCount,
  mode,
  state,
  handlers,
  features,
}: UseDataTableOptions<TData>) => {
  // TanStack Table intentionally returns mutable accessors; React Compiler skips this hook safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
  data,
  columns,
  getRowId,
  rowCount,
  state: {
    pagination: state.pagination,
    sorting: state.sorting,
    rowSelection: state.rowSelection,
    columnVisibility: state.columnVisibility,
    columnOrder: state.columnOrder,
    columnPinning: state.columnPinning,
    columnSizing: state.columnSizing,
  },
  onPaginationChange: handlers.onPaginationChange,
  onSortingChange: handlers.onSortingChange,
  onRowSelectionChange: handlers.onRowSelectionChange,
  onColumnVisibilityChange: handlers.onColumnVisibilityChange,
  onColumnOrderChange: handlers.onColumnOrderChange,
  onColumnPinningChange: handlers.onColumnPinningChange,
  onColumnSizingChange: handlers.onColumnSizingChange,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: mode === 'client' ? getSortedRowModel() : undefined,
  getPaginationRowModel: mode === 'client' ? getPaginationRowModel() : undefined,
  manualPagination: mode === 'server',
  manualSorting: mode === 'server',
  enableMultiSort: false,
  enableRowSelection: features?.selection ?? false,
  enableColumnResizing: features?.columnResize ?? true,
  columnResizeMode: 'onChange',
  });
};

