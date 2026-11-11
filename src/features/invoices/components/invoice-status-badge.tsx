import { useTranslation } from 'react-i18next';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { InvoiceStatus } from '../enums/invoice-status.enum';

export interface InvoiceStatusBadgeProps {
  status: InvoiceStatus | string;
  className?: string;
}

const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  [InvoiceStatus.PENDING]: 'warning',
  [InvoiceStatus.ISSUED]: 'success',
  [InvoiceStatus.VOID]: 'default',
};

const STATUS_KEY_MAP: Record<string, 'status.pending' | 'status.issued' | 'status.void'> = {
  [InvoiceStatus.PENDING]: 'status.pending',
  [InvoiceStatus.ISSUED]: 'status.issued',
  [InvoiceStatus.VOID]: 'status.void',
};

export const InvoiceStatusBadge = ({ status, className }: InvoiceStatusBadgeProps) => {
  const { t } = useTranslation('invoices');
  const variant = STATUS_VARIANT_MAP[status] ?? 'default';
  const labelKey = STATUS_KEY_MAP[status] ?? 'status.pending';

  return (
    <Badge variant={variant} className={className}>
      {t(labelKey)}
    </Badge>
  );
};
