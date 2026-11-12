import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

interface ChatReadReceiptProps {
  isGroup: boolean;
  readers: Array<{ id: string; name: string }>;
  totalRecipients: number;
}

export const ChatReadReceipt = ({ isGroup, readers, totalRecipients }: ChatReadReceiptProps) => {
  const { t } = useTranslation('chat');
  const [open, setOpen] = useState(false);
  if (readers.length === 0) return <p className="mt-1 text-right text-xs text-rentify-text-secondary">{t('sent')}</p>;
  if (!isGroup) return <p className="mt-1 text-right text-xs text-rentify-primary">{t('seen')}</p>;
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto mt-1 h-auto min-h-10 px-2 text-xs text-rentify-primary"
        onClick={() => setOpen(true)}
      >
        {t('seenCount', { count: readers.length, total: totalRecipients })}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t('seenBy')} maxWidth="sm">
        <ul className="space-y-2 p-4">
          {readers.map((reader) => (
            <li key={reader.id} className="text-sm text-rentify-text-primary">
              {reader.name}
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
};
