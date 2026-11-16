import { useTranslation } from 'react-i18next';
import { SortPopover } from './sort-popover';
import type { SortValue } from '../../constants/search.constants';

export interface SearchSummarySortBarProps {
  totalCount: number;
  currentSort: SortValue;
  onSortChange: (sort: SortValue) => void;
}

export const SearchSummarySortBar = ({ totalCount, currentSort, onSortChange }: SearchSummarySortBarProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-rentify-divider">
      <h2 className="text-xs sm:text-sm font-bold text-rentify-text-primary">
        {t('search.foundRooms', { count: totalCount })}
      </h2>

      <SortPopover currentSort={currentSort} onSortChange={onSortChange} />
    </div>
  );
};
