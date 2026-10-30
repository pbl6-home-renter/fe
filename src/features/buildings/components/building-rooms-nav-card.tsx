import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

interface BuildingRoomsNavCardProps {
  buildingId?: string;
}

export const BuildingRoomsNavCard = ({ buildingId }: BuildingRoomsNavCardProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  const handleNavigateRooms = () => {
    navigate(buildingId ? `/rooms?buildingId=${buildingId}` : '/rooms');
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
          {t('detail.roomsNavTag')}
        </span>
        <h3 className="text-xl font-bold">{t('detail.roomsNavTitle')}</h3>
        <p className="text-xs text-blue-100 leading-relaxed">
          {t('detail.roomsNavDesc')}
        </p>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={handleNavigateRooms}
          className="w-full h-11 rounded-xl bg-white text-rentify-primary font-bold text-xs hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <span>{t('detail.roomsNavAction')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
