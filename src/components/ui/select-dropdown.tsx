import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MOTION_DURATION, MOTION_EASE, MOTION_EXIT_EASE } from '@/lib/motion';
import { IconButton } from './icon-button';

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

const enabledIndex = (options: readonly SelectOption[], start: number, step: 1 | -1) => {
  if (options.length === 0) return -1;
  for (let offset = 0; offset < options.length; offset += 1) {
    const index = (start + offset * step + options.length * 2) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
};

export const SelectDropdown = ({
  id,
  name,
  label,
  error,
  helperText,
  options,
  placeholder,
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
  const generatedId = useId();
  const inputId = id ?? `select-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const messageId = `${inputId}-message`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const shouldSearch = searchable && options.length > 5;

  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(currentValue)),
    [options, currentValue],
  );
  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;
  }, [options, searchQuery]);
  const resolvedActiveIndex =
    filteredOptions[activeIndex] && !filteredOptions[activeIndex].disabled
      ? activeIndex
      : enabledIndex(filteredOptions, 0, 1);
  const activeOptionId = resolvedActiveIndex >= 0 ? `${listboxId}-option-${resolvedActiveIndex}` : undefined;

  const handleClose = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    setSearchQuery('');
    setActiveIndex(-1);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    const selectedIndex = options.findIndex(
      (option) => String(option.value) === String(currentValue) && !option.disabled,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndex(options, 0, 1));
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) handleClose();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, handleClose]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (shouldSearch) searchInputRef.current?.focus();
    else listboxRef.current?.focus();
  }, [isOpen, shouldSearch]);

  useEffect(() => {
    if (!disabled || !isOpen) return;
    const timer = window.setTimeout(() => handleClose(), 0);
    return () => window.clearTimeout(timer);
  }, [disabled, isOpen, handleClose]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    if (controlledValue === undefined) setInternalValue(option.value);
    onChange?.({ target: { value: String(option.value), name } });
    onSelectOption?.(option);
    handleClose(true);
  };

  const handlePopupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose(true);
    } else if (event.key === 'Tab') {
      handleClose();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const start =
        resolvedActiveIndex < 0 ? (step === 1 ? 0 : filteredOptions.length - 1) : resolvedActiveIndex + step;
      setActiveIndex(enabledIndex(filteredOptions, start, step));
    } else if (event.key === 'Home' || event.key === 'End') {
      if (event.target === searchInputRef.current) return;
      event.preventDefault();
      const step = event.key === 'Home' ? 1 : -1;
      setActiveIndex(enabledIndex(filteredOptions, step === 1 ? 0 : filteredOptions.length - 1, step));
    } else if (event.key === 'Enter' && resolvedActiveIndex >= 0) {
      event.preventDefault();
      handleSelect(filteredOptions[resolvedActiveIndex]);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative flex w-full flex-col gap-1.5 text-left', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="select-none text-xs font-semibold text-rentify-text-primary sm:text-sm">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-11 w-full items-center rounded-xl border bg-rentify-surface text-sm text-rentify-text-primary',
          'focus-within:ring-2 focus-within:ring-rentify-primary/15',
          isOpen ? 'border-rentify-primary shadow-xs' : 'border-rentify-divider hover:border-rentify-primary/40',
          disabled && 'cursor-not-allowed opacity-60',
          error && 'border-rentify-error focus-within:ring-rentify-error/15',
          className,
        )}
      >
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
          onClick={() => (isOpen ? handleClose(true) : handleOpen())}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              handleOpen();
            }
          }}
          className="flex h-full min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 text-left focus-visible:outline-none disabled:cursor-not-allowed"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {leadingIcon && <span className="shrink-0 text-rentify-text-secondary">{leadingIcon}</span>}
            <span className={cn('truncate', selectedOption ? 'font-medium' : 'text-rentify-text-secondary')}>
              {selectedOption?.label ?? placeholder ?? t('selectPlaceholder')}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-rentify-text-secondary transition-transform duration-150',
              isOpen && 'rotate-180 text-rentify-primary',
            )}
            aria-hidden="true"
          />
        </button>
        {clearable && selectedOption && !disabled && (
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={t('clear')}
            onClick={() => {
              if (controlledValue === undefined) setInternalValue('');
              onChange?.({ target: { value: '', name } });
              handleClose();
            }}
            className="mr-1"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        )}
      </div>
      {(error || helperText) && (
        <span
          id={messageId}
          className={cn('mt-0.5 text-xs', error ? 'font-medium text-rentify-error' : 'text-rentify-text-secondary')}
        >
          {error || helperText}
        </span>
      )}

      <AnimatePresence>
        {isOpen && !disabled && (
          <m.div
            key="popover"
            initial={{ opacity: 0, y: 4, scale: 0.99 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: MOTION_DURATION.menuEnter, ease: MOTION_EASE },
            }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.99,
              pointerEvents: 'none',
              transition: { duration: MOTION_DURATION.menuExit, ease: MOTION_EXIT_EASE },
            }}
            onKeyDown={handlePopupKeyDown}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-rentify-divider bg-rentify-surface py-1.5 shadow-spotlight"
          >
            {shouldSearch && (
              <div className="border-b border-rentify-divider px-2.5 pb-2 pt-1">
                <div className="relative flex items-center">
                  <Search
                    className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-rentify-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    aria-label={t('search')}
                    aria-controls={listboxId}
                    aria-activedescendant={activeOptionId}
                    onChange={(event) => {
                      const query = event.target.value;
                      setSearchQuery(query);
                      setActiveIndex(
                        enabledIndex(
                          options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase())),
                          0,
                          1,
                        ),
                      );
                    }}
                    placeholder={t('search')}
                    className="h-9 w-full rounded-lg border border-rentify-divider bg-rentify-background pl-8 pr-3 text-sm text-rentify-text-primary placeholder:text-rentify-text-secondary focus:border-rentify-primary focus:bg-rentify-surface focus:outline-none"
                  />
                </div>
              </div>
            )}
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              tabIndex={shouldSearch ? undefined : -1}
              aria-label={label ?? t('selectPlaceholder')}
              aria-activedescendant={shouldSearch ? undefined : activeOptionId}
              className="max-h-60 overflow-y-auto py-1 focus:outline-none"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-rentify-text-secondary">{t('noResults')}</div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = String(option.value) === String(currentValue);
                  return (
                    <div
                      key={String(option.value)}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        'flex min-h-10 cursor-pointer items-center justify-between px-3.5 py-2 text-sm',
                        option.disabled
                          ? 'cursor-not-allowed opacity-40'
                          : index === resolvedActiveIndex
                            ? 'bg-rentify-primary-container/40 text-rentify-primary'
                            : 'hover:bg-rentify-background',
                        isSelected && 'font-semibold text-rentify-primary',
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check className="ml-2 h-4 w-4 shrink-0 text-rentify-primary" aria-hidden="true" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SelectDropdown.displayName = 'SelectDropdown';
