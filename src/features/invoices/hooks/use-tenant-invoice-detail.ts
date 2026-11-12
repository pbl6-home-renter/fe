import { useParams } from 'react-router-dom';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { useInvoiceDetailQuery } from './use-invoice-detail-query';

export const useTenantInvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const invoiceId = id ?? '';
  const detailQuery = useInvoiceDetailQuery(invoiceId);

  const rawInvoice = detailQuery.data;
  const isIssued = rawInvoice?.invoiceStatus === InvoiceStatus.ISSUED;
  const invoice = isIssued ? rawInvoice : undefined;

  // Hide non-issued invoices from tenant views even if cached under shared query keys.
  const isUnavailable = !detailQuery.isLoading && (detailQuery.isError || !invoice);

  return {
    invoiceId,
    invoice,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    isUnavailable,
    refetch: detailQuery.refetch,
  };
};
