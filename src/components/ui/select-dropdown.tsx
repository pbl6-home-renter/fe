import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  id?: string;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  containerClassName?: string;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  onSelectOption?: (option: SelectOption) => void;
}

export const SelectDropdown = ({
  id,
  name,
  label,
  error,
  helperText,
  options,
  placeholder = 'Chọn một mục...',
  value: controlledValue,
  defaultValue,
  disabled = false,
  leadingIcon,
  containerClassName,
  className,
  searchable = true,
  clearable = false,
  onChange,
  onSelectOption,
}: SelectDropdownProps) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Tìm option đang được chọn
  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(currentValue)),
    [options, currentValue]
  );

  // Lọc options theo tìm kiếm
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  // Đóng khi click ngoài component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus ô tìm kiếm khi mở popover
  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Phím tắt ESC để đóng
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    if (onChange) {
      onChange({ target: { value: String(option.value), name } });
    }

    if (onSelectOption) {
      onSelectOption(option);
    }

    handleClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (!isControlled) {
      setInternalValue('');
    }

    if (onChange) {
      onChange({ target: { value: '', name } });
    }
  };

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-1.5 w-full text-left relative', containerClassName)}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-rentify-text-primary select-none"
        >
          {label}
        </label>
      )}

      {/* Main Select Trigger Box */}
      <div
        id={inputId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          'w-full h-11 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150',
          'flex items-center justify-between gap-2 select-none cursor-pointer',
          'bg-rentify-surface text-rentify-text-primary',
          isOpen
            ? 'border-rentify-primary ring-2 ring-rentify-primary/15 shadow-xs'
            : 'border-rentify-divider hover:border-slate-300',
          disabled && 'bg-slate-100 opacity-60 cursor-not-allowed border-slate-200',
          error && 'border-rentify-error ring-2 ring-rentify-error/15',
          className
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {leadingIcon && (
            <span className="text-rentify-text-secondary shrink-0">{leadingIcon}</span>
          )}

          {selectedOption ? (
            <span className="truncate font-medium text-rentify-text-primary">
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate text-rentify-text-secondary font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-rentify-text-secondary">
          {clearable && selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-rentify-text-primary rounded-full transition-colors"
              title={t('clear')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isOpen && 'rotate-180 text-rentify-primary'
            )}
          />
        </div>
      </div>

      {/* Error / Helper Text */}
      {error ? (
        <span className="text-xs text-rentify-error font-medium mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-rentify-text-secondary mt-0.5">{helperText}</span>
      ) : null}

      {/* Floating Popover Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          className={cn(
            'absolute left-0 right-0 top-full mt-1.5 z-50',
            'bg-rentify-surface rounded-xl border border-rentify-divider',
            'shadow-[0_12px_32px_-4px_rgba(20,42,76,0.12),0_4px_12px_-2px_rgba(20,42,76,0.06)]',
            'py-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150'
          )}
        >
          {/* Search filter input inside popover */}
          {searchable && options.length > 5 && (
            <div className="px-2.5 pt-1 pb-2 border-b border-rentify-divider/60">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-rentify-text-secondary absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className="w-full h-8.5 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-rentify-text-primary placeholder:text-rentify-text-secondary focus:outline-none focus:bg-rentify-surface focus:border-rentify-primary"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-rentify-text-secondary">
                {t('noResults')}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(currentValue);

                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      'px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors',
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-rentify-text-secondary'
                        : isSelected
                        ? 'bg-rentify-primary-container/20 text-rentify-primary font-semibold'
                        : 'text-rentify-text-primary hover:bg-slate-50 hover:text-rentify-primary'
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-rentify-primary shrink-0 ml-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SelectDropdown.displayName = 'SelectDropdown';
