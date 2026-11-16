import { useTranslation } from 'react-i18next';
import { ArrowUpDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SORT_OPTIONS, type SortValue } from '../../constants/search.constants';

export interface SortPopoverProps {
  currentSort: SortValue;
  onSortChange: (value: SortValue) => void;
}

export const SortPopover = ({ currentSort, onSortChange }: SortPopoverProps) => {
  const { t } = useTranslation('rooms');

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 px-3 gap-1.5 rounded-xl text-xs font-semibold border-rentify-divider bg-rentify-surface text-rentify-text-primary hover:border-rentify-primary"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-rentify-text-secondary shrink-0" />
          <span>{t(currentOption.labelKey)}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 p-1.5 space-y-0.5">
        {SORT_OPTIONS.map((option) => {
          const isSelected = option.value === currentSort;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer ${
                isSelected
                  ? 'bg-rentify-primary-container text-rentify-primary font-bold'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background'
              }`}
            >
              <span>{t(option.labelKey)}</span>
              {isSelected && <Check className="h-3.5 w-3.5 text-rentify-primary shrink-0 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
