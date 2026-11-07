import { ImagePlus, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Textarea } from '@/components/ui/textarea';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { CHAT_MESSAGE_MAX_LENGTH } from '../constants/chat.constants';
import { useChatLocalImagePreview } from '../hooks/use-chat-local-image-preview';

interface ChatComposerProps {
  value: string;
  readOnly: boolean;
  isSending: boolean;
  imageFile?: File;
  onChange: (value: string) => void;
  onSend: () => void;
  onSelectImage: (file?: File) => void;
  onRemoveImage: () => void;
}

export const ChatComposer = ({
  value,
  readOnly,
  isSending,
  imageFile,
  onChange,
  onSend,
  onSelectImage,
  onRemoveImage,
}: ChatComposerProps) => {
  const { t } = useTranslation('chat');
  const inputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrl = useChatLocalImagePreview(imageFile);
  const canSend =
    (value.trim().length > 0 || Boolean(imageFile)) && value.length <= CHAT_MESSAGE_MAX_LENGTH && !isSending;
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
      <input
        ref={inputRef}
        type="file"
        accept={getMediaAccept(MediaPurpose.CHAT_ATTACHMENT)}
        className="sr-only"
        aria-label={t('attachImage')}
        onChange={(event) => {
          onSelectImage(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
      />
      {imageFile && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-rentify-divider p-2">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt={t('photoSent')} className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <span className="h-14 w-14 animate-pulse rounded-lg bg-rentify-background" />
          )}
          <span className="min-w-0 flex-1 truncate text-sm">{imageFile.name}</span>
          <IconButton type="button" variant="ghost" size="sm" aria-label={t('removeImage')} onClick={onRemoveImage}>
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      )}
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
        {!imageFile && (
          <IconButton
            type="button"
            variant="outline"
            aria-label={t('attachImage')}
            disabled={isSending}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        )}
        <Button onClick={onSend} disabled={!canSend} aria-label={t('send')}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
