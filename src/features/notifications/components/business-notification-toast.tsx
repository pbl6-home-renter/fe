import { BellRing, CircleAlert, ReceiptText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import type { BusinessNotificationCategory } from '../types/notification.dto';

interface BusinessNotificationToastProps {
  category: BusinessNotificationCategory;
  title: string;
  body: string;
}

export const BusinessNotificationToast = ({ category, title, body }: BusinessNotificationToastProps) => {
  const { t } = useTranslation('notifications');
  const Icon = category === 'invoice' ? ReceiptText : category === 'issue' ? CircleAlert : BellRing;

  return (
    <Card className="flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 border-rentify-divider bg-rentify-surface p-4 text-rentify-text-primary shadow-lg">
      <span className="mt-0.5 rounded-full bg-rentify-primary-container p-2 text-rentify-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-1 flex items-center gap-1 text-xs font-medium text-rentify-text-secondary">
          <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
          {t(`categories.${category}`)}
        </span>
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="mt-1 block line-clamp-3 whitespace-pre-wrap break-words text-sm text-rentify-text-secondary">
          {body}
        </span>
      </span>
    </Card>
  );
};
