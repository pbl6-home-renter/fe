import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ROUTES } from '@/config/routes.config';

export interface TenantHomeBannerProps {
  isAuthenticated: boolean;
  userDisplayName: string;
  hasUnreadNotifications: boolean;
  keyword: string;
  onKeywordChange: (val: string) => void;
  onOpenFilter: () => void;
  onSearch: (e?: React.FormEvent) => void;
}

export const TenantHomeBanner = ({
  isAuthenticated,
  userDisplayName,
  hasUnreadNotifications,
  keyword,
  onKeywordChange,
  onOpenFilter,
  onSearch,
}: TenantHomeBannerProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="relative w-full">
      {/* 1. Gradient Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-gradient px-6 py-8 sm:px-12 sm:pt-12 sm:pb-24 text-white shadow-card">
        {/* Decorative subtle ambient circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            {isAuthenticated ? (
              <>
                <p className="text-xs sm:text-sm font-medium tracking-wide text-white/80">
                  {t('tenantHome.greeting', { name: userDisplayName })}
                </p>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {t('tenantHome.howAreYou')}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 pt-1 leading-relaxed">
                  {t('tenantHome.loggedSubtitle')}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {t('tenantHome.guestTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 pt-1 leading-relaxed">{t('tenantHome.guestSubtitle')}</p>
              </>
            )}
          </div>

          {/* Right Header Action: Bell Notification button for authenticated user */}
          {isAuthenticated && (
            <div className="self-end sm:self-auto shrink-0">
              <IconButton
                variant="ghost"
                size="md"
                onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                aria-label={t('tenantHome.notifications')}
                className="relative bg-white/15 text-white hover:bg-white/25 hover:text-white rounded-full border border-white/20 backdrop-blur-xs"
              >
                <Bell className="w-5 h-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rentify-error ring-2 ring-white" />
                )}
              </IconButton>
            </div>
          )}
        </div>
      </div>

      {/* 2. Floating Search Bar Overlapping Banner Bottom */}
      <div className="-mt-8 sm:-mt-12 mx-auto w-full max-w-4xl px-3 sm:px-6 relative z-20">
        <form
          onSubmit={onSearch}
          className="bg-rentify-surface rounded-2xl sm:rounded-full border border-rentify-divider shadow-spotlight p-2 sm:p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3"
        >
          {/* Segment 1: Search Keyword */}
          <div className="flex-1 w-full flex items-center gap-3 px-3 py-1.5 min-w-0">
            <Search className="w-4 h-4 text-rentify-primary shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-bold text-rentify-text-primary tracking-tight">
                {t('tenantHome.searchLabel')}
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                placeholder={t('tenantHome.searchPlaceholder')}
                aria-label={t('tenantHome.searchPlaceholder')}
                className="text-xs text-rentify-text-secondary bg-transparent focus:outline-none placeholder:text-rentify-text-muted truncate w-full"
              />
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-rentify-divider shrink-0" />

          {/* Segment 2: Quick Area link */}
          <button
            type="button"
            onClick={onOpenFilter}
            aria-label={t('tenantHome.areaLabel')}
            className="hidden sm:flex flex-col text-left px-3 py-1.5 rounded-xl hover:bg-rentify-background transition-colors"
          >
            <span className="text-[11px] font-bold text-rentify-text-primary tracking-tight">
              {t('tenantHome.areaLabel')}
            </span>
            <span className="text-xs text-rentify-text-secondary truncate">{t('tenantHome.allAreas')}</span>
          </button>

          <div className="hidden sm:block h-8 w-px bg-rentify-divider shrink-0" />

          {/* Segment 3: Quick Price link */}
          <button
            type="button"
            onClick={onOpenFilter}
            aria-label={t('tenantHome.priceLabel')}
            className="hidden sm:flex flex-col text-left px-3 py-1.5 rounded-xl hover:bg-rentify-background transition-colors"
          >
            <span className="text-[11px] font-bold text-rentify-text-primary tracking-tight">
              {t('tenantHome.priceLabel')}
            </span>
            <span className="text-xs text-rentify-text-secondary truncate">{t('tenantHome.allPrices')}</span>
          </button>

          {/* Filter & Submit Button Group */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-rentify-divider">
            <IconButton
              type="button"
              variant="outline"
              size="md"
              onClick={onOpenFilter}
              aria-label={t('tenantHome.filterButton')}
              className="rounded-full border-rentify-divider hover:border-rentify-primary hover:text-rentify-primary"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </IconButton>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="rounded-xl sm:rounded-full px-5 text-xs font-semibold gap-2 shadow-xs w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              <span>{t('tenantHome.searchButton')}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
