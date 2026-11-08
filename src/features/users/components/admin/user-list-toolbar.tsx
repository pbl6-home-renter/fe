import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user';

export interface UserListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export const UserListToolbar = ({
  searchValue,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  isFiltered,
  onClearFilters,
}: UserListToolbarProps) => {
  const { t } = useTranslation('users');

  const roleOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allRoles') },
      { value: Role.ADMIN, label: t('roles.admin') },
      { value: Role.LANDLORD, label: t('roles.landlord') },
      { value: Role.TENANT, label: t('roles.tenant') },
    ],
    [t],
  );

  const statusOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allStatuses') },
      { value: UserStatus.ACTIVE, label: t('status.active') },
      { value: UserStatus.LOCKED, label: t('status.locked') },
    ],
    [t],
  );

  return (
    <DataTableToolbar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t('filters.searchPlaceholder')}
      filters={
        <div className="flex flex-wrap items-center gap-2">
          <SelectDropdown
            options={roleOptions}
            value={selectedRole}
            onSelectOption={(opt) => onRoleChange(String(opt.value))}
            containerClassName="w-40"
            className="min-h-10 text-xs"
            searchable={false}
          />
          <SelectDropdown
            options={statusOptions}
            value={selectedStatus}
            onSelectOption={(opt) => onStatusChange(String(opt.value))}
            containerClassName="w-40"
            className="min-h-10 text-xs"
            searchable={false}
          />
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="min-h-10 gap-1.5 text-xs text-rentify-text-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('filters.reset')}</span>
            </Button>
          )}
        </div>
      }
    />
  );
};
