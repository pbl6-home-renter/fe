import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';

export interface SearchHeaderProps {
  keyword: string;
  activeFilterCount: number;
  onKeywordChange: (val: string) => void;
  onKeywordSubmit: (e?: React.FormEvent) => void;
  onClearKeyword: () => void;
  onOpenFilter: () => void;
  onBack: () => void;
}

export const SearchHeader = ({
  keyword,
  activeFilterCount,
  onKeywordChange,
  onKeywordSubmit,
  onClearKeyword,
  onOpenFilter,
  onBack,
}: SearchHeaderProps) => {
  const { t } = useTranslation('rooms');

  return (
    <div className="sticky top-0 z-30 w-full bg-rentify-surface/95 backdrop-blur-md border-b border-rentify-divider py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="w-full flex items-center gap-3">
        {/* Back Button */}
        <IconButton
          type="button"
          variant="ghost"
          size="md"
          onClick={onBack}
          aria-label={t('search.backToSearch')}
          className="rounded-full text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </IconButton>

        {/* Search Bar Input */}
        <form onSubmit={onKeywordSubmit} className="flex-1 relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-rentify-text-muted pointer-events-none shrink-0" />

          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={t('search.searchPlaceholder')}
            aria-label={t('search.searchPlaceholder')}
            className="w-full h-11 pl-10 pr-9 rounded-full bg-rentify-background border border-rentify-divider text-xs sm:text-sm text-rentify-text-primary placeholder:text-rentify-text-muted focus:outline-none focus:border-rentify-primary focus:ring-2 focus:ring-rentify-primary/20 transition-all"
          />

          {keyword && (
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearKeyword}
              aria-label={t('cancel')}
              className="absolute right-2.5 h-6 w-6 rounded-full text-rentify-text-muted hover:text-rentify-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </IconButton>
          )}
        </form>

        {/* Filter Trigger Button with Badge */}
        <Button
          type="button"
          variant={activeFilterCount > 0 ? 'secondary' : 'outline'}
          size="md"
          onClick={onOpenFilter}
          aria-label={t('search.filterTitle')}
          className={`relative h-11 px-4 rounded-full text-xs font-semibold gap-2 shrink-0 ${
            activeFilterCount > 0
              ? 'border-rentify-primary text-rentify-primary bg-rentify-primary-container/60'
              : 'border-rentify-divider text-rentify-text-primary'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-current shrink-0" />
          <span className="hidden sm:inline">{t('search.filterBadge')}</span>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-rentify-primary text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
