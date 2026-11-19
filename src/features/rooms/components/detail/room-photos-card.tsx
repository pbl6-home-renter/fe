import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';

interface RoomPhotosCardProps {
  photos?: string[];
}

export const RoomPhotosCard = ({ photos = [] }: RoomPhotosCardProps) => {
  const { t } = useTranslation('rooms');
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <Card className="space-y-4">
        <div className="pb-3 border-b border-rentify-divider">
          <h3 className="font-bold text-base text-rentify-text-primary">{t('detail.photosTitle')}</h3>
          <p className="text-xs text-rentify-text-secondary">{t('detail.photosSubtitle')}</p>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center bg-surface-container-low/50 rounded-xl border border-dashed border-rentify-divider">
          <div className="w-10 h-10 rounded-full bg-rentify-surface flex items-center justify-center text-rentify-text-secondary mb-2">
            <ImageIcon className="w-5 h-5" />
          </div>
          <p className="text-xs text-rentify-text-secondary">{t('detail.noPhotos')}</p>
        </div>
      </Card>
    );
  }

  const activePhoto = photos[selectedIndex] || photos[0];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div>
          <h3 className="font-bold text-base text-rentify-text-primary">{t('detail.photosTitle')}</h3>
          <p className="text-xs text-rentify-text-secondary">{t('detail.photosSubtitle')}</p>
        </div>
        <span className="text-xs text-rentify-text-secondary font-medium">
          {selectedIndex + 1} / {photos.length}
        </span>
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-container-low border border-rentify-divider">
        <img
          src={activePhoto}
          alt={t('detail.photosTitle')}
          className="w-full h-full object-cover transition-all duration-300"
        />
        {selectedIndex === 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-bold rounded-lg bg-rentify-primary text-white shadow-sm">
            {t('uploader.coverBadge')}
          </span>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {photos.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                idx === selectedIndex
                  ? 'border-rentify-primary shadow-sm scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};
