import { Bell, CheckCheck, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { NotificationPreferencesDialog } from '../components/notification-preferences-dialog';
import { useNotificationsPage } from '../hooks/use-notifications-page';

export const NotificationsPage = () => {
  const { t, i18n } = useTranslation('notifications');
  const { t: tc } = useTranslation('common');
  const page = useNotificationsPage();
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'vi-VN';

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-5">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <>
            <Button variant="outline" size="md" onClick={page.onOpenPreferences}>
              <Settings2 className="h-4 w-4" aria-hidden="true" />
              {t('preferences.button')}
            </Button>
            <Button
              variant="outline"
              size="md"
              disabled={!page.hasUnread || page.isMarkingAllRead}
              isLoading={page.isMarkingAllRead}
              onClick={page.onMarkAllRead}
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              {t('markAllRead')}
            </Button>
          </>
        }
      />

      <div className="flex gap-2" aria-label={t('filters.label')}>
        <Button
          variant={!page.unreadOnly ? 'secondary' : 'ghost'}
          size="md"
          aria-pressed={!page.unreadOnly}
          onClick={() => page.onSetUnreadOnly(false)}
        >
          {t('filters.all')}
        </Button>
        <Button
          variant={page.unreadOnly ? 'secondary' : 'ghost'}
          size="md"
          aria-pressed={page.unreadOnly}
          onClick={() => page.onSetUnreadOnly(true)}
        >
          {t('filters.unread')}
        </Button>
      </div>

      <section className="min-h-0 flex-1 overflow-y-auto" aria-live="polite">
        {page.query.isLoading ? (
          <div className="space-y-3" role="status" aria-label={t('loading')}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : page.query.isError && !page.query.data ? (
          <ErrorState
            title={tc('error')}
            message={t('loadError')}
            retryText={t('retry')}
            onRetry={() => void page.query.refetch()}
          />
        ) : page.items.length === 0 ? (
          <Card className="flex flex-col items-center p-10 text-center">
            <Bell className="mb-3 h-9 w-9 text-rentify-neutral" aria-hidden="true" />
            <p className="font-semibold">{t(page.unreadOnly ? 'emptyUnread' : 'empty')}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {page.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => page.onOpenNotification(item)}
                className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
              >
                <Card
                  className={`flex gap-3 p-4 transition-colors hover:bg-rentify-background ${item.readAt ? '' : 'border-rentify-primary/30 bg-rentify-primary-container/20'}`}
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.readAt ? 'bg-rentify-neutral/40' : 'bg-rentify-primary'}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="font-semibold text-rentify-text-primary">{item.title}</span>
                      <time className="text-xs text-rentify-text-secondary" dateTime={item.createdAt}>
                        {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
                          new Date(item.createdAt),
                        )}
                      </time>
                    </span>
                    <span className="mt-1 block whitespace-pre-wrap text-sm text-rentify-text-secondary">
                      {item.body}
                    </span>
                  </span>
                </Card>
              </button>
            ))}
            {page.query.hasNextPage && (
              <div className="py-2 text-center">
                <Button
                  variant="outline"
                  size="md"
                  isLoading={page.query.isFetchingNextPage}
                  onClick={() => void page.query.fetchNextPage()}
                >
                  {t('loadMore')}
                </Button>
              </div>
            )}
            {page.query.isFetchNextPageError && (
              <div role="alert" className="space-y-2 py-2 text-center text-sm text-rentify-error">
                <p>{t('loadMoreError')}</p>
                <Button variant="outline" size="sm" onClick={() => void page.query.fetchNextPage()}>
                  {t('retry')}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
      <NotificationPreferencesDialog open={page.preferencesOpen} onClose={page.onClosePreferences} />
    </div>
  );
};
