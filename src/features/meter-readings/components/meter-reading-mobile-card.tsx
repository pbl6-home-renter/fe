import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Droplets, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { MeterReadingCellInput } from './meter-reading-cell-input';
import { MeterType } from '../enums/meter-type.enum';
import type { RoomReadingRowState } from '../types/meter-reading.dto';

interface MeterReadingMobileCardProps {
  row: RoomReadingRowState;
  onReadingChange: (roomId: string, type: MeterType, val: string) => void;
  onCellOcrSuccess: (
    roomId: string,
    type: MeterType,
    data: {
      currentReading?: string;
      evidenceMediaId: string;
      previewUrl: string;
      source: 'manual' | 'ocr';
      ocrValue?: string | null;
      ocrConfidence?: number;
    },
  ) => void;
  onOpenSingleModal: (row: RoomReadingRowState, type: MeterType) => void;
  onViewImage: (url: string) => void;
}

export const MeterReadingMobileCard = ({
  row,
  onReadingChange,
  onCellOcrSuccess,
  onOpenSingleModal,
  onViewImage,
}: MeterReadingMobileCardProps) => {
  const { t } = useTranslation('meterReadings');
  const navigate = useNavigate();
  const isSaved = row.electricity.isSaved || row.water.isSaved;

  return (
    <Card className="p-4 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-rentify-divider pb-2.5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.LANDLORD.ROOM_DETAIL(row.roomId))}
          className="font-bold text-sm text-rentify-primary hover:underline text-left cursor-pointer"
        >
          {row.roomName}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenSingleModal(row, MeterType.ELECTRICITY)}
          className="h-7 text-[11px] gap-1 text-rentify-primary hover:bg-rentify-primary/10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isSaved ? t('actions.viewDetails') : t('actions.detailEntry')}</span>
        </Button>
      </div>

      <div className="space-y-3">
        {/* Electricity Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('types.electricity')} (kWh)</span>
          </div>
          <MeterReadingCellInput
            roomId={row.roomId}
            type={MeterType.ELECTRICITY}
            previousReading={row.electricity.previousReading}
            currentReading={row.electricity.currentReading}
            consumption={row.electricity.consumption}
            evidenceMediaId={row.electricity.evidenceMediaId}
            evidencePreviewUrl={row.electricity.evidencePreviewUrl}
            source={row.electricity.source}
            ocrValue={row.electricity.ocrValue}
            ocrConfidence={row.electricity.ocrConfidence}
            isSaved={row.electricity.isSaved}
            onReadingChange={(val) => onReadingChange(row.roomId, MeterType.ELECTRICITY, val)}
            onOcrSuccess={(data) => onCellOcrSuccess(row.roomId, MeterType.ELECTRICITY, data)}
            onViewImage={onViewImage}
          />
        </div>

        {/* Water Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
            <Droplets className="w-3.5 h-3.5" />
            <span>{t('types.water')} (m³)</span>
          </div>
          <MeterReadingCellInput
            roomId={row.roomId}
            type={MeterType.WATER}
            previousReading={row.water.previousReading}
            currentReading={row.water.currentReading}
            consumption={row.water.consumption}
            evidenceMediaId={row.water.evidenceMediaId}
            evidencePreviewUrl={row.water.evidencePreviewUrl}
            source={row.water.source}
            ocrValue={row.water.ocrValue}
            ocrConfidence={row.water.ocrConfidence}
            isSaved={row.water.isSaved}
            onReadingChange={(val) => onReadingChange(row.roomId, MeterType.WATER, val)}
            onOcrSuccess={(data) => onCellOcrSuccess(row.roomId, MeterType.WATER, data)}
            onViewImage={onViewImage}
          />
        </div>
      </div>
    </Card>
  );
};
