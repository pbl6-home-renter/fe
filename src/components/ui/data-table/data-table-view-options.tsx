import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Column, Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DataTableDensity } from './data-table.types';

interface SortableColumnItemProps<TData> {
  column: Column<TData, unknown>;
}

const SortableColumnItem = <TData,>({ column }: SortableColumnItemProps<TData>) => {
  const { t } = useTranslation();
  const pinned = column.getIsPinned();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
    disabled: Boolean(pinned),
  });
  const columnLabel = column.columnDef.meta?.label ?? column.id;
  const isRequired = !column.getCanHide() || column.columnDef.meta?.hideable === false;
  const canToggleVisibility = !isRequired && !pinned;
  const pinningLabel = pinned === 'left'
    ? t('dataTable.pinnedLeft')
    : pinned === 'right'
      ? t('dataTable.pinnedRight')
      : t('dataTable.notPinned');

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-1 rounded-lg focus-within:bg-rentify-primary-container"
    >
      <IconButton
        variant="ghost"
        size="sm"
        aria-label={pinned
          ? t('dataTable.reorderPinnedColumn', { column: columnLabel })
          : t('dataTable.reorderColumn', { column: columnLabel })}
        title={pinned ? t('dataTable.unpinBeforeReorder') : undefined}
        disabled={Boolean(pinned)}
        className="cursor-grab touch-none disabled:cursor-not-allowed disabled:opacity-35"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </IconButton>
      <DropdownMenuCheckboxItem
        checked={column.getIsVisible()}
        disabled={!canToggleVisibility}
        onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
        onSelect={(event) => event.preventDefault()}
        className="flex-1"
      >
        <span className="truncate">{columnLabel}</span>
        {(isRequired || pinned) && (
          <span className="ml-auto rounded-md bg-surface-container-low px-1.5 py-0.5 text-[10px] font-semibold text-rentify-text-secondary">
            {isRequired ? t('dataTable.requiredColumn') : t('dataTable.unpinToHide')}
          </span>
        )}
      </DropdownMenuCheckboxItem>
      {column.columnDef.meta?.pinnable !== false && (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="min-h-8 shrink-0 px-2 text-xs text-rentify-text-secondary">
            {pinningLabel}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-44">
            <DropdownMenuRadioGroup
              value={pinned || 'none'}
              onValueChange={(value) => {
                if (value !== 'none') column.toggleVisibility(true);
                column.pin(value === 'none' ? false : value as 'left' | 'right');
              }}
            >
              <DropdownMenuRadioItem value="none" onSelect={(event) => event.preventDefault()}>
                {t('dataTable.notPinned')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="left" onSelect={(event) => event.preventDefault()}>
                {t('dataTable.pinColumnLeft')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right" onSelect={(event) => event.preventDefault()}>
                {t('dataTable.pinColumnRight')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}
    </div>
  );
};

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
}

export const DataTableViewOptions = <TData,>({
  table,
  density,
  onDensityChange,
}: DataTableViewOptionsProps<TData>) => {
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const columns = table.getAllLeafColumns().filter((column) => column.id !== 'select');
  const sortableColumnIds = columns
    .filter((column) => !column.getIsPinned())
    .map((column) => column.id);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const current = table.getState().columnOrder.length
      ? table.getState().columnOrder
      : table.getAllLeafColumns().map((column) => column.id);
    table.setColumnOrder(arrayMove(current, current.indexOf(String(active.id)), current.indexOf(String(over.id))));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dataTable.view')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="max-h-[28rem] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain"
      >
        <DropdownMenuLabel>{t('dataTable.columns')}</DropdownMenuLabel>
        <p className="px-2.5 pb-2 text-xs leading-relaxed text-rentify-text-secondary">
          {t('dataTable.columnSettingsHelp')}
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableColumnIds} strategy={verticalListSortingStrategy}>
            {columns.map((column) => <SortableColumnItem key={column.id} column={column} />)}
          </SortableContext>
        </DndContext>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('dataTable.density')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={(value) => onDensityChange(value as DataTableDensity)}>
          <DropdownMenuRadioItem value="compact" onSelect={(event) => event.preventDefault()}>
            {t('dataTable.compact')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="standard" onSelect={(event) => event.preventDefault()}>
            {t('dataTable.standard')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable" onSelect={(event) => event.preventDefault()}>
            {t('dataTable.comfortable')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

