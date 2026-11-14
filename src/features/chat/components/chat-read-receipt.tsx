import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/features/users/components/user-avatar';
import { Dialog } from '@/components/ui/dialog';

export interface ChatReader {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface ChatReadReceiptProps {
  isGroup: boolean;
  readers: ChatReader[];
  totalRecipients: number;
}

const MAX_STACKED_READERS = 4;

const ReaderAvatar = ({ reader }: { reader: ChatReader }) => (
  <UserAvatar name={reader.name} src={reader.avatarUrl} size="2xs" className="ring-2 ring-rentify-background" />
);

/** Messenger-style receipt under the caller's latest message: tiny avatars of who has seen it. */
export const ChatReadReceipt = ({ isGroup, readers, totalRecipients }: ChatReadReceiptProps) => {
  const { t } = useTranslation('chat');
  const [open, setOpen] = useState(false);

  if (readers.length === 0) {
    return (
      <p className="mt-0.5 flex items-center gap-1 px-1 text-[11px] text-rentify-neutral">
        <Check className="h-3 w-3" aria-hidden="true" />
        {t('sent')}
      </p>
    );
  }

  if (!isGroup) {
    return (
      <p className="mt-0.5 flex items-center gap-1 px-1 text-[11px] text-rentify-text-secondary">
        <ReaderAvatar reader={readers[0]} />
        {t('seen')}
      </p>
    );
  }

  const stacked = readers.slice(0, MAX_STACKED_READERS);
  const label = t('seenCount', { count: readers.length, total: totalRecipients });
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className="ui-press mt-0.5 flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[11px] text-rentify-text-secondary hover:bg-rentify-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
      >
        <span className="flex -space-x-1">
          {stacked.map((reader) => (
            <ReaderAvatar key={reader.id} reader={reader} />
          ))}
        </span>
        {readers.length > stacked.length && <span>+{readers.length - stacked.length}</span>}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t('seenBy')} description={label} maxWidth="sm">
        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {readers.map((reader) => (
            <li key={reader.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
              <UserAvatar name={reader.name} src={reader.avatarUrl} size="sm" />
              <span className="truncate text-sm text-rentify-text-primary">{reader.name}</span>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
};
