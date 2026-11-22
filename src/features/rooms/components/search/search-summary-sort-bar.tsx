import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { SortPopover } from './sort-popover';
import { cn } from '@/lib/utils/cn';
import type { SortValue } from '../../constants/search.constants';

export interface SearchSummarySortBarProps {
  totalCount: number;
  currentSort: SortValue;
  onSortChange: (sort: SortValue) => void;
  isFavorites?: boolean;
  onSelectAllRooms?: () => void;
  onSelectFavorites?: () => void;
  canFavorite?: boolean;
}

export const SearchSummarySortBar = ({
  totalCount,
  currentSort,
  onSortChange,
  isFavorites = false,
  onSelectAllRooms,
  onSelectFavorites,
  canFavorite = true,
}: SearchSummarySortBarProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-rentify-divider">
      <div className="flex items-center flex-wrap gap-3">
        {canFavorite && onSelectAllRooms && onSelectFavorites && (
          <div className="inline-flex items-center p-1 bg-rentify-background border border-rentify-divider rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={onSelectAllRooms}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                !isFavorites
                  ? 'bg-rentify-surface text-rentify-primary font-bold shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary',
              )}
            >
              {t('search.allRoomsTab')}
            </button>
            <button
              type="button"
              onClick={onSelectFavorites}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5',
                isFavorites
                  ? 'bg-rentify-surface text-rentify-primary font-bold shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary',
              )}
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5',
                  isFavorites ? 'fill-rentify-error text-rentify-error' : 'text-rentify-text-secondary',
                )}
              />
              <span>{t('search.savedRoomsTab')}</span>
            </button>
          </div>
        )}

        {canFavorite && onSelectAllRooms && onSelectFavorites && (
          <span className="text-xs text-rentify-text-muted hidden md:inline">|</span>
        )}

        <h2 className="text-xs sm:text-sm font-bold text-rentify-text-primary">
          {isFavorites
            ? t('search.favoriteRoomsCount', { count: totalCount })
            : t('search.foundRooms', { count: totalCount })}
        </h2>
      </div>

      <div className="flex items-center justify-end">
        <SortPopover currentSort={currentSort} onSortChange={onSortChange} />
      </div>
    </div>
  );
};
