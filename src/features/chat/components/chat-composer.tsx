import { Paperclip, FileText, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatBotReminderPreview } from '../utils/format-chat-message';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Textarea } from '@/components/ui/textarea';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { CHAT_MESSAGE_MAX_LENGTH } from '../constants/chat.constants';
import { useChatLocalImagePreview } from '../hooks/use-chat-local-image-preview';
import type { ChatReplyReference } from '../types/chat.dto';

interface ChatComposerProps {
  value: string;
  readOnly: boolean;
  isSending: boolean;
  imageFile?: File;
  replyTo?: ChatReplyReference;
  onChange: (value: string) => void;
  onSend: () => void;
  onSelectImage: (file?: File) => void;
  onRemoveImage: () => void;
  onCancelReply: () => void;
  onBlur: () => void;
}

export const ChatComposer = ({
  value,
  readOnly,
  isSending,
  imageFile,
  replyTo,
  onChange,
  onSend,
  onSelectImage,
  onRemoveImage,
  onCancelReply,
  onBlur,
}: ChatComposerProps) => {
  const { t } = useTranslation('chat');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imagePreviewUrl = useChatLocalImagePreview(imageFile);
  const canSend =
    (value.trim().length > 0 || Boolean(imageFile)) && value.length <= CHAT_MESSAGE_MAX_LENGTH && !isSending;
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSend) onSend();
    }
  };
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [value]);
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);
  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const image = Array.from(event.clipboardData.files).find((file) => file.type.startsWith('image/'));
    if (!image) return;
    event.preventDefault();
    onSelectImage(image);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const image = event.dataTransfer.files[0];
    if (image) onSelectImage(image);
  };

  if (readOnly)
    return (
      <p className="border-t border-rentify-divider p-4 text-center text-sm text-rentify-text-secondary">
        {t('readOnly')}
      </p>
    );
  return (
    <div
      className={`relative border-t bg-rentify-surface p-4 ${isDragging ? 'border-rentify-primary ring-2 ring-inset ring-rentify-primary' : 'border-rentify-divider'}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (Array.from(event.dataTransfer.types).includes('Files')) setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={getMediaAccept(MediaPurpose.CHAT_ATTACHMENT)}
        className="sr-only"
        aria-label={t('attachFile')}
        onChange={(event) => {
          onSelectImage(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
      />
      {isDragging && (
        <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-rentify-primary-container/90 text-sm font-medium text-rentify-on-primary-container">
          {t('dropFile')}
        </p>
      )}
      {replyTo && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border-l-2 border-rentify-primary bg-rentify-background px-3 py-2">
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-semibold text-rentify-primary">
              {t('replyingTo', { name: replyTo.senderName ?? t('replyUnavailable') })}
            </p>
            <p className="truncate text-rentify-text-secondary">{(replyTo.contentPreview && replyTo.type === 'bot' ? formatBotReminderPreview(replyTo.contentPreview, t) : replyTo.contentPreview) || t(replyTo.type === 'video' ? 'videoSent' : replyTo.type === 'file' ? 'fileSent' : 'photoSent')}</p>
          </div>
          <IconButton type="button" variant="ghost" aria-label={t('cancelReply')} onClick={onCancelReply}>
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      )}
      {imageFile && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-rentify-divider p-2">
          {imageFile.type.startsWith('image/') && imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt={t('photoSent')} className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <FileText className="h-10 w-10 text-rentify-text-secondary" aria-hidden="true" />
          )}
          <span className="min-w-0 flex-1 truncate text-sm">{imageFile.name}</span>
          <IconButton type="button" variant="ghost" size="sm" aria-label={t('removeFile')} onClick={onRemoveImage}>
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      )}
      <div className="flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          label={t('composerLabel')}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={onBlur}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          rows={1}
          placeholder={t('composerPlaceholder')}
          className="min-h-11 max-h-36 resize-none overflow-y-auto"
        />
        {!imageFile && (
          <IconButton
            type="button"
            variant="outline"
            aria-label={t('attachFile')}
            disabled={isSending}
            onClick={() => inputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        )}
        <Button onClick={onSend} disabled={!canSend} aria-label={t('send')}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
