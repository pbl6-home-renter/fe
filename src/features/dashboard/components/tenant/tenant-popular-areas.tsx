import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes.config';
import { POPULAR_AREAS, type PopularAreaItem } from '../../constants/tenant-dashboard.constants';

export interface TenantPopularAreasProps {
  onSelectArea: (area: PopularAreaItem) => void;
}

export const TenantPopularAreas = ({ onSelectArea }: TenantPopularAreasProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">
          {t('tenantHome.popularAreasTitle')}
        </h2>

        <button
          type="button"
          onClick={() => navigate(ROUTES.ROOMS_SEARCH)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-primary hover:text-teal-accent transition-colors"
        >
          <span>{t('tenantHome.viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scrollable Row / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {POPULAR_AREAS.map((area) => (
          <Card
            key={area.id}
            variant="interactive"
            onClick={() => onSelectArea(area)}
            className="p-3.5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs hover:border-rentify-primary/40 hover:shadow-card transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-background border border-rentify-divider text-rentify-text-secondary group-hover:text-rentify-primary group-hover:border-rentify-primary/30 transition-colors">
              <Building className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-rentify-text-secondary leading-none">
                {area.type === 'ward' ? t('tenantHome.ward') : t('tenantHome.district')}
              </span>
              <span className="block text-xs sm:text-sm font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate mt-1">
                {area.name}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
