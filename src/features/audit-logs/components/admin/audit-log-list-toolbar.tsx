import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown';
import { cn } from '@/lib/utils/cn';
import { AUDIT_LOG_ACTION_VALUES } from '../../enums/audit-log-action.enum';
import { AUDIT_LOG_ENTITY_TYPE_VALUES } from '../../enums/audit-log-entity-type.enum';

export interface AuditLogListToolbarProps {
  selectedAction: string;
  onActionChange: (action: string) => void;
  selectedEntityType: string;
  onEntityTypeChange: (entityType: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  hasDateRangeError: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export const AuditLogListToolbar = ({
  selectedAction,
  onActionChange,
  selectedEntityType,
  onEntityTypeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  hasDateRangeError,
  isFiltered,
  onClearFilters,
}: AuditLogListToolbarProps) => {
  const { t } = useTranslation('auditLogs');

  const actionOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allActions') },
      ...AUDIT_LOG_ACTION_VALUES.map((action) => ({
        value: action,
        label: t(`actions.${action}`),
      })),
    ],
    [t],
  );

  const entityTypeOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allEntityTypes') },
      ...AUDIT_LOG_ENTITY_TYPE_VALUES.map((entityType) => ({
        value: entityType,
        label: t(`entityTypes.${entityType}`),
      })),
    ],
    [t],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2.5">
        <div className="w-full sm:w-52">
          <SelectDropdown
            label={t('filters.actionLabel')}
            options={actionOptions}
            value={selectedAction}
            onSelectOption={(opt) => onActionChange(String(opt.value))}
            className="min-h-10 text-xs"
            searchable={false}
          />
        </div>

        <div className="w-full sm:w-44">
          <SelectDropdown
            label={t('filters.entityTypeLabel')}
            options={entityTypeOptions}
            value={selectedEntityType}
            onSelectOption={(opt) => onEntityTypeChange(String(opt.value))}
            className="min-h-10 text-xs"
            searchable={false}
          />
        </div>

        <div className="w-full sm:w-44">
          <Input
            type="date"
            label={t('filters.fromDateLabel')}
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            aria-invalid={hasDateRangeError}
            className={cn(
              'min-h-10 py-2 text-sm',
              hasDateRangeError && 'border-rentify-error focus:border-rentify-error focus:ring-rentify-error/20',
            )}
          />
        </div>

        <div className="w-full sm:w-44">
          <Input
            type="date"
            label={t('filters.toDateLabel')}
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            aria-invalid={hasDateRangeError}
            className={cn(
              'min-h-10 py-2 text-sm',
              hasDateRangeError && 'border-rentify-error focus:border-rentify-error focus:ring-rentify-error/20',
            )}
          />
        </div>

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

      {hasDateRangeError && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rentify-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t('filters.dateRangeError')}</span>
        </p>
      )}
    </div>
  );
};
