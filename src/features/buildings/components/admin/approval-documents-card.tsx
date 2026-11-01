import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { FileCheck, FileText, ExternalLink, ShieldAlert } from 'lucide-react';
import type { BuildingAdminOwnershipDocument } from '../../types/building.dto';

interface ApprovalDocumentsCardProps {
  documents: BuildingAdminOwnershipDocument[];
}

export const ApprovalDocumentsCard = ({ documents }: ApprovalDocumentsCardProps) => {
  const { t } = useTranslation('buildings');

  return (
    <Card className="p-6 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-4">
      <div className="pb-3 border-b border-rentify-divider">
        <h3 className="text-base font-bold text-rentify-text-primary flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-rentify-primary" />
          <span>{t('admin.documentsTitle')}</span>
        </h3>
        <p className="text-xs text-rentify-text-secondary mt-0.5">
          {t('admin.documentsDesc')}
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="p-4 rounded-xl bg-surface-container-low/60 flex items-center gap-3 text-xs text-rentify-text-secondary">
          <ShieldAlert className="w-4 h-4 text-rentify-warning shrink-0" />
          <span>{t('admin.noDocuments')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc, idx) => (
            <a
              key={doc.id || idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-rentify-divider bg-surface-container-low/40 hover:bg-surface-container-low hover:border-rentify-primary transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-rentify-primary-container text-rentify-primary flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-rentify-text-primary truncate group-hover:text-rentify-primary transition-colors">
                    {doc.name || `Tài liệu xác minh #${idx + 1}`}
                  </p>
                  <p className="text-[11px] text-rentify-text-secondary">
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('vi-VN') : 'PDF / Image'}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-rentify-text-secondary group-hover:text-rentify-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      )}
    </Card>
  );
};
