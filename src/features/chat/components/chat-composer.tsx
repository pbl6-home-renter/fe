import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CHAT_MESSAGE_MAX_LENGTH } from '../constants/chat.constants';

interface ChatComposerProps {
  value: string;
  readOnly: boolean;
  isSending: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatComposer = ({ value, readOnly, isSending, onChange, onSend }: ChatComposerProps) => {
  const { t } = useTranslation('chat');
  const canSend = value.trim().length > 0 && value.length <= CHAT_MESSAGE_MAX_LENGTH && !isSending;
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend();
    }
  };

  if (readOnly)
    return (
      <p className="border-t border-rentify-divider p-4 text-center text-sm text-rentify-text-secondary">
        {t('readOnly')}
      </p>
    );
  return (
    <div className="border-t border-rentify-divider bg-rentify-surface p-4">
      <div className="flex items-end gap-3">
        <Textarea
          label={t('composerLabel')}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          rows={2}
          placeholder={t('composerPlaceholder')}
          className="min-h-11 resize-none"
        />
        <Button onClick={onSend} disabled={!canSend} aria-label={t('send')}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
