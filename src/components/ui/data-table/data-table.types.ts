import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

/* eslint-disable @typescript-eslint/no-unused-vars -- TanStack requires both generic parameters in module augmentation. */

export type DataTableDensity = 'compact' | 'standard' | 'comfortable';
export type DataTableAlign = 'left' | 'center' | 'right';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    align?: DataTableAlign;
    pinnable?: boolean;
    hideable?: boolean;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface DataTableControlledState {
  pagination: PaginationState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: ColumnSizingState;
  density: DataTableDensity;
}

export interface DataTableStateHandlers {
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  onColumnOrderChange: OnChangeFn<ColumnOrderState>;
  onColumnPinningChange: OnChangeFn<ColumnPinningState>;
  onColumnSizingChange: OnChangeFn<ColumnSizingState>;
}

export interface DataTableEmptyState {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

