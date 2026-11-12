import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ChatWindowErrorProps {
  onRetry: () => void;
  onBack: () => void;
}

export const ChatWindowError = ({ onRetry, onBack }: ChatWindowErrorProps) => {
  const { t } = useTranslation('chat');
  return (
    <section className="flex min-w-0 flex-1 items-center justify-center p-8">
      <div className="text-center">
        <p>{t('conversationMissing')}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={onRetry}>
            {t('tryLoadAgain')}
          </Button>
          <Button variant="outline" size="sm" onClick={onBack}>
            {t('backToList')}
          </Button>
        </div>
      </div>
    </section>
  );
};
