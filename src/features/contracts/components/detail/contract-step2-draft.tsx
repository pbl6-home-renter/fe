import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGenerateDraftContractMutation } from '../../hooks/use-generate-draft-contract-mutation';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractStep2DraftProps {
  contract: ContractDetailDto;
  onRefresh: () => void;
}

export const ContractStep2Draft = ({
  contract,
  onRefresh,
}: ContractStep2DraftProps) => {
  const { t } = useTranslation('contracts');
  const [draftMediaId, setDraftMediaId] = useState<string | null>(
    contract.draftDocumentMediaId || null
  );

  const isDraft = contract.status === ContractStatus.DRAFT;

  const generateDraftMutation = useGenerateDraftContractMutation({
    onSuccess: (data) => {
      if (data.mediaId) {
        setDraftMediaId(data.mediaId);
      }
      onRefresh();
    },
  });

  const draftPdfObject = useMediaObjectUrl(
    draftMediaId ? `/api/v1/media/${draftMediaId}` : null
  );

  const handleGenerateDraft = () => {
    generateDraftMutation.mutate({
      id: contract.id,
      payload: { templateKey: contract.templateKey || 'standard_residential_v1' },
    });
  };

  return (
    <div className="space-y-3 rounded-xl border border-rentify-divider p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-rentify-text-primary">
            {t('detail.step2Title')}
          </h3>
          <p className="text-xs text-rentify-text-secondary">
            {t('detail.step2Desc')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isDraft && (
          <Button
            variant="outline"
            size="md"
            onClick={handleGenerateDraft}
            isLoading={generateDraftMutation.isPending}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>{t('detail.step2GenerateBtn')}</span>
          </Button>
        )}

        {draftMediaId && draftPdfObject.src && (
          <a
            href={draftPdfObject.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rentify-primary/30 bg-rentify-primary-container px-3 py-2 text-xs font-semibold text-rentify-primary transition-colors hover:bg-rentify-primary/20"
          >
            <Download className="h-4 w-4" />
            <span>{t('detail.step2ViewPdf')}</span>
          </a>
        )}
      </div>
    </div>
  );
};
