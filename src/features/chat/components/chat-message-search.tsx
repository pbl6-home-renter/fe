import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/feedback/skeleton';
import type { ChatMessageSearchResult } from '../types/chat.dto';
import { CHAT_SEARCH_MAX_LENGTH } from '../constants/chat.constants';

interface ChatMessageSearchProps {
  value: string;
  results: ChatMessageSearchResult[];
  isLoading: boolean;
  isError: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onSelect: (result: ChatMessageSearchResult) => void;
}

export const ChatMessageSearch = (props: ChatMessageSearchProps) => {
  const { t, i18n } = useTranslation('chat');
  const query = props.value.trim();
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';
  return (
    <section
      className="flex min-h-0 flex-1 flex-col bg-rentify-background"
      aria-label={t('searchMessages')}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          props.onClose();
        }
      }}
    >
      <div className="flex items-center gap-2 border-b border-rentify-divider bg-rentify-surface px-4 py-3">
        <Input
          autoFocus
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          maxLength={CHAT_SEARCH_MAX_LENGTH}
          placeholder={t('searchMessagesPlaceholder')}
          aria-label={t('searchMessages')}
          leadingIcon={<Search className="h-4 w-4" aria-hidden="true" />}
        />
        <IconButton type="button" variant="ghost" aria-label={t('closeSearchMessages')} onClick={props.onClose}>
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {query.length < 2 && (
          <p className="py-8 text-center text-sm text-rentify-text-secondary">{t('searchMessagesHint')}</p>
        )}
        {query.length >= 2 && props.isLoading && (
          <div role="status" aria-label={t('searchingMessages')} className="space-y-3">
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-20 rounded-xl" />
            ))}
          </div>
        )}
        {query.length >= 2 && props.isError && (
          <div className="py-8 text-center">
            <p className="text-sm text-rentify-error">{t('messageSearchError')}</p>
            <Button variant="ghost" onClick={props.onRetry}>
              {t('tryLoadAgain')}
            </Button>
          </div>
        )}
        {query.length >= 2 && !props.isLoading && !props.isError && props.results.length === 0 && (
          <p className="py-8 text-center text-sm text-rentify-text-secondary">{t('noMessageResults')}</p>
        )}
        {query.length >= 2 && !props.isLoading && !props.isError && props.results.length > 0 && (
          <ul className="space-y-2">
            {props.results.map((result) => (
              <li key={result.id}>
                <Button
                  variant="ghost"
                  className="h-auto min-h-16 w-full flex-col items-start rounded-xl border border-rentify-divider bg-rentify-surface p-3 text-left"
                  onClick={() => props.onSelect(result)}
                >
                  <span className="flex w-full justify-between gap-3 text-xs text-rentify-text-secondary">
                    <strong className="truncate text-rentify-text-primary">{result.senderName}</strong>
                    <time className="shrink-0">
                      {new Date(result.createdAt).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
                    </time>
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-rentify-text-primary">
                    {result.contentPreview || t('photoSent')}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {query.length >= 2 && !props.isLoading && !props.isError && props.hasMore && (
          <Button
            variant="ghost"
            className="mx-auto mt-3 flex"
            isLoading={props.isLoadingMore}
            onClick={props.onLoadMore}
          >
            {t('loadMoreResults')}
          </Button>
        )}
      </div>
    </section>
  );
};
