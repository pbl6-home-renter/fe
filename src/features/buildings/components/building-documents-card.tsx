import { useTranslation } from 'react-i18next';
import { FileCheck2, ExternalLink, UploadCloud, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';

interface BuildingDocumentItemProps {
  url: string;
  index: number;
}

const BuildingDocumentItem = ({ url, index }: BuildingDocumentItemProps) => {
  const { t } = useTranslation('buildings');
  const { src, isLoading } = useMediaObjectUrl(url);

  return (
    <a
      href={src ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!src) e.preventDefault();
      }}
      className={`flex items-center justify-between p-3.5 rounded-xl border border-rentify-divider hover:bg-surface-container-low hover:border-rentify-primary/40 transition-all text-xs group ${
        !src ? 'cursor-wait opacity-70' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <div className="w-8 h-8 rounded-lg bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center shrink-0">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <span className="font-semibold text-rentify-text-primary truncate">
          {t('detail.documentItem', { index: index + 1 })}
        </span>
      </div>
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-rentify-text-secondary animate-spin shrink-0" />
      ) : (
        <ExternalLink className="w-4 h-4 text-rentify-text-secondary group-hover:text-rentify-primary transition shrink-0" />
      )}
    </a>
  );
};

export interface BuildingDocumentsCardProps {
  certificateUrls?: string[];
  onUpload?: () => void;
}

export const BuildingDocumentsCard = ({ certificateUrls, onUpload }: BuildingDocumentsCardProps) => {
  const { t } = useTranslation('buildings');

  const hasDocs = Boolean(certificateUrls && certificateUrls.length > 0);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-rentify-primary" />
          <h2 className="text-base font-bold text-rentify-text-primary">{t('detail.documentsTitle')}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-rentify-text-secondary">
            {t('detail.filesCount', { count: certificateUrls?.length || 0 })}
          </span>
          {onUpload && (
            <Button variant="outline" size="sm" onClick={onUpload} className="gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>{t('detail.uploadDocumentsAction')}</span>
            </Button>
          )}
        </div>
      </div>

      {hasDocs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certificateUrls!.map((url, idx) => (
            <BuildingDocumentItem key={idx} url={url} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs text-rentify-text-secondary">{t('detail.noDocuments')}</p>
          {onUpload && (
            <Button variant="outline" size="sm" onClick={onUpload} className="gap-1.5 mt-1">
              <UploadCloud className="w-4 h-4" />
              <span>{t('detail.uploadDocumentsAction')}</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
