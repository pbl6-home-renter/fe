import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchHelperText?: string;
  filters?: ReactNode;
}

export const DataTableToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchHelperText,
  filters,
}: DataTableToolbarProps) => {
  const { t } = useTranslation();
  const showSearch = searchValue !== undefined && onSearchChange;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      {showSearch && (
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder ?? t('search')}
          helperText={searchHelperText}
          leadingIcon={<Search className="h-4 w-4" />}
          trailingIcon={searchValue ? (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={t('dataTable.clearSearch')}
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </IconButton>
          ) : undefined}
          containerClassName="w-full sm:max-w-sm"
          className="min-h-10"
        />
      )}
      {filters && <div className="flex flex-1 flex-wrap items-center gap-2">{filters}</div>}
    </div>
  );
};

