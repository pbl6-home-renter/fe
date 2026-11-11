import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@/components/ui/button';

interface BuildingRoomsNavCardProps {
  buildingId?: string;
}

export const BuildingRoomsNavCard = ({ buildingId }: BuildingRoomsNavCardProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  return (
    <div className="bg-rentify-primary rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rentify-primary-container">
          {t('detail.roomsNavTag')}
        </span>
        <h3 className="text-xl font-bold">{t('detail.roomsNavTitle')}</h3>
        <p className="text-xs text-rentify-primary-container/90 leading-relaxed">{t('detail.roomsNavDesc')}</p>
      </div>

      <div className="pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate(buildingId ? `${ROUTES.LANDLORD.ROOMS}?buildingId=${buildingId}` : ROUTES.LANDLORD.ROOMS)
          }
          className="w-full bg-rentify-surface text-rentify-primary hover:bg-surface-container-low"
        >
          <span>{t('detail.roomsNavAction')}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
