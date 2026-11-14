import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ErrorState } from '@/components/feedback/error-state';
import { formatDate, formatMonth, formatVnd } from '@/lib/utils/format';
import { useBotReminder } from '../hooks/use-bot-reminder';

export const BotReminderDialog = ({ conversationId, contractId, open, onClose }: { conversationId: string; contractId: string; open: boolean; onClose: () => void }) => {
  const { t } = useTranslation('chat');
  const reminder = useBotReminder(conversationId, contractId, open, onClose);
  const { invoices, contract } = reminder;
  return (
    <Dialog open={open} onClose={onClose} title={t('reminder.title')} description={t('reminder.description')} closeOnEsc={!reminder.isSending} closeOnOutsideClick={!reminder.isSending}
      footer={<><Button variant="outline" onClick={onClose} disabled={reminder.isSending}>{t('reminder.cancel')}</Button><Button onClick={reminder.send} disabled={!reminder.canSend} isLoading={reminder.isSending}>{t('reminder.send')}</Button></>}>
      <div className="space-y-4">
        <label className="block space-y-1 text-sm font-medium">
          <span>{t('reminder.template')}</span>
          <select className="w-full rounded-lg border border-rentify-divider bg-rentify-surface p-2 text-rentify-text-primary" value={reminder.template} onChange={(event) => reminder.setTemplate(event.target.value as 'invoice' | 'contract_expiring')} disabled={reminder.isSending}>
            <option value="invoice">{t('reminder.invoice')}</option>
            <option value="contract_expiring">{t('reminder.contract')}</option>
          </select>
        </label>
        {reminder.template === 'invoice' ? (
          invoices.isLoading ? <p>{t('reminder.loading')}</p> : invoices.isError ? <ErrorState onRetry={() => void invoices.refetch()} /> : !invoices.data?.items.length ? <p>{t('reminder.noInvoices')}</p> : (
            <>
              <label className="block space-y-1 text-sm font-medium">
                <span>{t('reminder.selectInvoice')}</span>
                <select className="w-full rounded-lg border border-rentify-divider bg-rentify-surface p-2 text-rentify-text-primary" value={reminder.invoiceId} onChange={(event) => reminder.setInvoiceId(event.target.value)} disabled={reminder.isSending}>
                  <option value="">{t('reminder.chooseInvoice')}</option>
                  {invoices.data.items.map((invoice) => <option value={invoice.id} key={invoice.id}>{invoice.code} · {formatMonth(invoice.period)} · {formatVnd(invoice.totalAmount)}</option>)}
                </select>
              </label>
            </>
          )
        ) : contract.isLoading ? <p>{t('reminder.loading')}</p> : contract.isError ? <ErrorState onRetry={() => void contract.refetch()} /> : reminder.canSend && contract.data ? <p>{t('reminder.contractEnd', { date: formatDate(contract.data.endDate) })}</p> : <p>{t('reminder.noContract')}</p>}
        {reminder.template === 'invoice' && !invoices.isError && invoices.data && (reminder.pageNo > 1 || invoices.data.pagination.hasNextPage) && (
          <div className="flex items-center justify-between gap-2 text-sm">
            <Button variant="outline" size="sm" disabled={reminder.pageNo <= 1 || reminder.isSending} onClick={() => { reminder.setInvoiceId(''); reminder.setPageNo(reminder.pageNo - 1); }}>{t('reminder.previous')}</Button>
            <span>{t('reminder.page', { page: reminder.pageNo })}</span>
            <Button variant="outline" size="sm" disabled={!invoices.data.pagination.hasNextPage || reminder.isSending} onClick={() => { reminder.setInvoiceId(''); reminder.setPageNo(reminder.pageNo + 1); }}>{t('reminder.next')}</Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
