import { useTranslation } from 'react-i18next';
import { Clock, Trash2, X } from 'lucide-react';

export interface RecentSearchesBarProps {
  searches: string[];
  onSelect: (keyword: string) => void;
  onRemove: (keyword: string) => void;
  onClearAll: () => void;
}

export const RecentSearchesBar = ({ searches, onSelect, onRemove, onClearAll }: RecentSearchesBarProps) => {
  const { t } = useTranslation('rooms');

  if (searches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary shrink-0 font-medium">
        <Clock className="w-3.5 h-3.5 text-rentify-primary" />
        <span>{t('search.recentSearches')}:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-nowrap">
        {searches.map((term) => (
          <span
            key={term}
            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-rentify-surface border border-rentify-divider text-xs text-rentify-text-primary shadow-2xs hover:border-rentify-primary/40 shrink-0 transition-all"
          >
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="font-medium hover:text-rentify-primary transition-colors truncate max-w-36 text-left"
            >
              {term}
            </button>
            <button
              type="button"
              onClick={() => onRemove(term)}
              className="h-4 w-4 rounded-full flex items-center justify-center text-rentify-text-muted hover:text-rentify-error transition-colors"
              aria-label={t('cancel')}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-rentify-text-secondary hover:text-rentify-error transition-colors shrink-0 ml-1"
      >
        <Trash2 className="w-3 h-3" />
        <span>{t('search.clearAll')}</span>
      </button>
    </div>
  );
};
