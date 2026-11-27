import { useTranslation } from 'react-i18next';
import { RotateCcw, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown';

export interface ModerationListToolbarProps {
  statusOptions: readonly SelectOption[];
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  categoryOptions?: readonly SelectOption[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
  /** User id taken from the URL (`?userId=` / `?reportedUserId=`). */
  userId: string | null;
  onClearUser: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export const ModerationListToolbar = ({
  statusOptions,
  selectedStatus,
  onStatusChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
  userId,
  onClearUser,
  isFiltered,
  onClearFilters,
}: ModerationListToolbarProps) => {
  const { t } = useTranslation('moderation');

  return (
    <div className="flex flex-wrap items-end gap-2.5">
      <div className="w-full sm:w-48">
        <SelectDropdown
          label={t('filters.statusLabel')}
          options={statusOptions}
          value={selectedStatus}
          onSelectOption={(option) => onStatusChange(String(option.value))}
          className="min-h-10 text-xs"
          searchable={false}
        />
      </div>

      {categoryOptions && onCategoryChange && (
        <div className="w-full sm:w-56">
          <SelectDropdown
            label={t('filters.categoryLabel')}
            options={categoryOptions}
            value={selectedCategory}
            onSelectOption={(option) => onCategoryChange(String(option.value))}
            className="min-h-10 text-xs"
            searchable={false}
          />
        </div>
      )}

      {userId && (
        <span className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-rentify-primary/40 bg-rentify-primary-container/30 pl-3 pr-1 text-xs font-medium text-rentify-primary">
          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('filters.byUser', { id: userId.slice(0, 8) })}</span>
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            aria-label={t('filters.clearUser')}
            onClick={onClearUser}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        </span>
      )}

      {isFiltered && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="min-h-10 gap-1.5 text-xs text-rentify-text-secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('filters.reset')}</span>
        </Button>
      )}
    </div>
  );
};
