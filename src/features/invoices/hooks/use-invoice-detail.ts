import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useRoomQuery } from '@/features/rooms/hooks/use-room-query';
import { useDisclosure } from '@/hooks/use-disclosure';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceGenerateResponseDto, InvoiceIssueResponseDto } from '../types/invoices.dto';
import { useGenerateInvoicesMutation } from './use-generate-invoices-mutation';
import { useInvoiceDetailQuery } from './use-invoice-detail-query';
import { useIssueInvoicesMutation } from './use-issue-invoices-mutation';

export const useInvoiceDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const invoiceQuery = useInvoiceDetailQuery(id);
  const invoice = invoiceQuery.data;

  const isVoid = invoice?.invoiceStatus === InvoiceStatus.VOID;
  const roomQuery = useRoomQuery(isVoid ? invoice?.roomId : undefined);
  const buildingId = roomQuery.data?.buildingId ?? '';

  const otherFeesDialog = useDisclosure(false);
  const cancelDialog = useDisclosure(false);

  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [issueResult, setIssueResult] = useState<InvoiceIssueResponseDto | null>(null);
  const [regenerateResult, setRegenerateResult] = useState<InvoiceGenerateResponseDto | null>(null);

  const issueMutation = useIssueInvoicesMutation();
  const generateMutation = useGenerateInvoicesMutation();

  const handleOpenIssueDialog = () => {
    setIdempotencyKey(crypto.randomUUID());
    setIssueResult(null);
    setIssueDialogOpen(true);
  };

  const handleConfirmIssue = () => {
    if (!invoice || !idempotencyKey) return;
    issueMutation.mutate(
      {
        payload: { invoiceIds: [invoice.id] },
        idempotencyKey,
      },
      {
        onSuccess: (result) => {
          setIssueResult(result);
          if (result.failed.length === 0) {
            setIssueDialogOpen(false);
            setIssueResult(null);
          }
        },
      },
    );
  };

  const handleCloseIssueDialog = () => {
    if (issueMutation.isPending) return;
    setIssueDialogOpen(false);
    setIssueResult(null);
  };

  const handleRegenerate = () => {
    if (!invoice || !buildingId) return;
    generateMutation.mutate(
      { buildingId, period: invoice.period },
      {
        onSuccess: (result) => {
          const replacement =
            result.generated.find((item) => item.contractId === invoice.contractId) ??
            result.recalculated.find((item) => item.contractId === invoice.contractId);
          if (replacement) {
            navigate(ROUTES.LANDLORD.INVOICE_DETAIL(replacement.invoiceId));
            return;
          }
          setRegenerateResult(result);
        },
      },
    );
  };

  const handleCloseRegenerateResult = () => {
    setRegenerateResult(null);
  };

  return {
    invoice,
    buildingId,
    isLoading: invoiceQuery.isLoading,
    isError: invoiceQuery.isError,
    refetch: invoiceQuery.refetch,
    isLoadingRoom: roomQuery.isLoading,
    otherFeesDialog,
    cancelDialog,
    issueDialogOpen,
    issueResult,
    isIssuing: issueMutation.isPending,
    isRegenerating: generateMutation.isPending,
    regenerateResult,
    handleOpenIssueDialog,
    handleConfirmIssue,
    handleCloseIssueDialog,
    handleRegenerate,
    handleCloseRegenerateResult,
  };
};
