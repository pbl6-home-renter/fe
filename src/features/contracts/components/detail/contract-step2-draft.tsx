import { useTranslation } from 'react-i18next';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDraftPdf } from '../../hooks/use-draft-pdf';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { ContractDetailDto } from '../../types/contract.dto';

export const ContractStep2Draft = ({ contract }: { contract: ContractDetailDto }) => {
  const { t } = useTranslation('contracts');
  const { url, isPending, generate } = useDraftPdf(contract.id);
  return (
    <div className="space-y-3 rounded-xl border border-rentify-divider p-4">
      <div>
        <h3 className="text-sm font-semibold text-rentify-text-primary">{t('detail.step2Title')}</h3>
        <p className="text-xs text-rentify-text-secondary">{t('detail.step2Desc')}</p>
        {!contract.templateKey && <p className="text-xs text-rentify-text-secondary">{t('detail.step2ApplyFirst')}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {contract.status === ContractStatus.DRAFT && (
          <Button variant="outline" size="md" onClick={generate} isLoading={isPending} disabled={isPending || !contract.templateKey} className="gap-2">
            <FileText className="h-4 w-4" />
            <span>{t('detail.step2GenerateBtn')}</span>
          </Button>
        )}
        {url && (
          <>
            <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-rentify-primary hover:underline">{t('detail.step2ViewPdf')}</a>
            <a href={url} download={`contract-HD-${contract.id.slice(0, 6)}-draft.pdf`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-rentify-primary hover:underline">
              <Download className="h-4 w-4" />{t('detail.step2DownloadPdf')}
            </a>
          </>
        )}
      </div>
    </div>
  );
};
