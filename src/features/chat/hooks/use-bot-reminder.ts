import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { useContractQuery } from '@/features/contracts/hooks/use-contract-query';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import { useInvoicesQuery } from '@/features/invoices/hooks/use-invoices-query';
import { InvoiceStatus } from '@/features/invoices/enums/invoice-status.enum';
import { chatApi } from '../api/chat.api';
import { CHAT_LIST_QUERY_KEY, chatKeys } from '../constants/chat.constants';

type ReminderTemplate = 'invoice' | 'contract_expiring';

export const useBotReminder = (conversationId: string, contractId: string, open: boolean, onClose: () => void) => {
  const [template, setTemplateState] = useState<ReminderTemplate>('invoice');
  const [invoiceId, setInvoiceState] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const client = useQueryClient();
  const { t } = useTranslation('chat');
  const notify = useNotify();
  const contract = useContractQuery(contractId, open && template === 'contract_expiring');
  const invoices = useInvoicesQuery({ pageNo, pageSize: 20, filter: { contractId, status: InvoiceStatus.ISSUED } }, { enabled: open && template === 'invoice', placeholderData: undefined });
  const mutation = useMutation({
    mutationFn: ({ resourceId, clientMessageId }: { resourceId: string; clientMessageId: string }) =>
      chatApi.sendReminder(conversationId, { templateType: template, resourceId, clientMessageId }),
    onSuccess: async () => {
      attempt.current = null;
      await Promise.all([
        client.invalidateQueries({ queryKey: chatKeys.messageHistory(conversationId) }),
        client.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY }),
      ]);
      notify.success(t('reminder.sent'));
      onClose();
    },
  });
  const setTemplate = (value: ReminderTemplate) => {
    if (value !== template) attempt.current = null;
    setTemplateState(value);
    setInvoiceState('');
    setPageNo(1);
  };
  const setInvoiceId = (value: string) => {
    if (value !== invoiceId) attempt.current = null;
    setInvoiceState(value);
  };
  const resourceId = template === 'invoice' ? invoiceId : contractId;
  const canSend = template === 'invoice'
    ? !invoices.isError && !invoices.isFetching && Boolean(invoices.data?.items.some((invoice) => invoice.id === invoiceId))
    : !contract.isError && !contract.isFetching && contract.data?.status === ContractStatus.ACTIVE;
  const send = () => {
    if (!canSend || mutation.isPending) return;
    const fingerprint = `${conversationId}:${template}:${resourceId}`;
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
    mutation.mutate({ resourceId, clientMessageId: attempt.current.id });
  };
  return { template, setTemplate, invoiceId, setInvoiceId, pageNo, setPageNo, contract, invoices, canSend, send, isSending: mutation.isPending };
};
