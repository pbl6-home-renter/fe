import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

export interface RoomPublicGalleryProps {
  photos: string[];
  selectedPhotoIndex: number;
  onSelectPhoto: (index: number) => void;
  roomName: string;
}

export const RoomPublicGallery = ({ photos, selectedPhotoIndex, onSelectPhoto, roomName }: RoomPublicGalleryProps) => {
  const { t } = useTranslation('rooms');
  const activePhoto = photos[selectedPhotoIndex] || photos[0];

  return (
    <div className="space-y-3">
      {/* Main Large Photo */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-rentify-surface-container-low rounded-3xl overflow-hidden border border-rentify-divider shadow-xs">
        <img src={activePhoto} alt={roomName} className="w-full h-full object-cover transition-all duration-300" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rentify-surface/90 backdrop-blur-md border border-rentify-success/30 text-rentify-success shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-rentify-success" />
            <span>{t('search.availableBadge')}</span>
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-rentify-card/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-rentify-text-primary border border-rentify-divider shadow-xs">
          {selectedPhotoIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {photos.map((url, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`Photo ${idx + 1}`}
              onClick={() => onSelectPhoto(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectPhoto(idx);
                }
              }}
              className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                selectedPhotoIndex === idx
                  ? 'border-rentify-primary ring-2 ring-rentify-primary/20'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
