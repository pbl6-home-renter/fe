import { useTranslation } from 'react-i18next';
import { RotateCcw, X } from 'lucide-react';

export interface ActiveChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  chips: ActiveChipItem[];
  onClearAll: () => void;
}

export const ActiveFilterChips = ({ chips, onClearAll }: ActiveFilterChipsProps) => {
  const { t } = useTranslation('rooms');

  if (chips.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-rentify-primary-container text-rentify-primary border border-rentify-primary/20 text-xs font-semibold shrink-0"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              chip.onRemove();
            }}
            aria-label={t('cancel')}
            className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-rentify-primary/20 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-current" />
          </button>
        </span>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-rentify-text-secondary hover:text-rentify-error hover:bg-rentify-error/10 transition-colors shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('search.clearAllFilters')}</span>
        </button>
      )}
    </div>
  );
};
