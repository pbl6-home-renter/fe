import { FileText } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { ContractStatusBadge } from './contract-status-badge';
import { formatDate, formatVnd } from '@/lib/utils/format';
import type { ContractListItemDto } from '../types/contract.dto';

export const ContractListMobileRow = ({ row }: { row: Row<ContractListItemDto> }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-rentify-text-primary">
              {row.original.contractCode}
            </p>
            <p className="text-xs text-rentify-text-secondary">
              {row.original.roomName} • {row.original.tenantName || '—'}
            </p>
          </div>
        </div>
        <ContractStatusBadge status={row.original.status} />
      </div>

      <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
        <span className="font-semibold text-rentify-text-primary tabular-nums">
          {formatVnd(row.original.rentPrice)}
        </span>
        <span className="tabular-nums">
          {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
        </span>
      </div>
    </div>
  );
};
