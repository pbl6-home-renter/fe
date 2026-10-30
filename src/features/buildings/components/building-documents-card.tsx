import { useTranslation } from 'react-i18next';
import { FileCheck2, ExternalLink } from 'lucide-react';

interface BuildingDocumentsCardProps {
  certificateUrls?: string[];
}

export const BuildingDocumentsCard = ({ certificateUrls }: BuildingDocumentsCardProps) => {
  const { t } = useTranslation('buildings');

  return (
    <div className="bg-rentify-surface rounded-2xl p-6 border border-rentify-divider shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-rentify-primary" />
          <h2 className="text-base font-bold text-rentify-text-primary">
            {t('detail.documentsTitle')}
          </h2>
        </div>
        <span className="text-xs text-rentify-text-secondary">
          {t('detail.filesCount', { count: certificateUrls?.length || 0 })}
        </span>
      </div>

      {certificateUrls && certificateUrls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certificateUrls.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-rentify-divider hover:bg-surface-container-low hover:border-rentify-primary/40 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-lg bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-rentify-text-primary truncate">
                  {t('detail.documentItem', { index: idx + 1 })}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-rentify-text-secondary group-hover:text-rentify-primary transition shrink-0" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-rentify-text-secondary">{t('detail.noDocuments')}</p>
      )}
    </div>
  );
};
