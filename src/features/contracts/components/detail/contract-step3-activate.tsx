import { useTranslation } from 'react-i18next';
import { CheckCircle2, FileSignature, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContractActivateStep } from '../../hooks/use-contract-activate-step';
import { ContractActivateDialog } from './contract-activate-dialog';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractStep3ActivateProps {
  contract: ContractDetailDto;
  onRefresh: () => void;
}

export const ContractStep3Activate = ({ contract, onRefresh }: ContractStep3ActivateProps) => {
  const { t } = useTranslation('contracts');
  const {
    signedMediaId,
    isActivateDialogOpen,
    setIsActivateDialogOpen,
    uploadError,
    fileInputRef,
    isActive,
    isActivating,
    isUploading,
    uploadProgress,
    signedPdfObject,
    handleFileChange,
    handleConfirmActivate,
  } = useContractActivateStep({ contract, onRefresh });

  return (
    <div className="space-y-3 rounded-xl border border-rentify-divider p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-rentify-text-primary">{t('detail.step3Title')}</h3>
          <p className="text-xs text-rentify-text-secondary">{t('detail.step3Desc')}</p>
        </div>
        {isActive && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rentify-success">
            <CheckCircle2 className="h-4 w-4" />
            {t('detail.step3ActiveStatus')}
          </span>
        )}
      </div>

      {isActive ? (
        <div className="space-y-3">
          <p className="rounded-xl bg-rentify-success/10 p-3 text-xs text-rentify-text-primary">
            {t('detail.step3ActiveNotice')}
          </p>
          {signedMediaId && signedPdfObject.src && (
            <a
              href={signedPdfObject.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-rentify-divider bg-rentify-surface px-3 py-2 text-xs font-semibold text-rentify-text-primary transition-colors hover:border-rentify-primary"
            >
              <FileSignature className="h-4 w-4 text-rentify-primary" />
              <span>{t('detail.step3ViewSigned')}</span>
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadError && <p className="text-xs text-rentify-error">{uploadError}</p>}

          {signedMediaId ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-rentify-success/20 bg-rentify-success/10 p-3 text-xs text-rentify-text-primary">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-rentify-success" />
              <span className="flex-1 font-medium">{t('detail.step3UploadSuccess')}</span>
              {signedPdfObject.src && (
                <a
                  href={signedPdfObject.src}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline hover:text-rentify-success"
                >
                  {t('detail.step3ViewSigned')}
                </a>
              )}
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                {t('detail.step3Reupload')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rentify-divider p-6 text-center">
              <Upload className="mb-2 h-8 w-8 text-rentify-outline" />
              <p className="text-xs text-rentify-text-secondary">{t('detail.step3UploadNotice')}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
                className="mt-3"
              >
                {isUploading ? t('detail.step3Uploading', { progress: uploadProgress }) : t('detail.step3SelectFile')}
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rentify-divider pt-3">
            <span className="text-xs text-rentify-text-secondary">
              {!signedMediaId && t('detail.step3ActivateHint')}
            </span>
            <Button
              variant="primary"
              size="md"
              disabled={!signedMediaId || isActivating}
              onClick={() => setIsActivateDialogOpen(true)}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('detail.step3ActivateBtn')}</span>
            </Button>
          </div>
        </div>
      )}

      <ContractActivateDialog
        open={isActivateDialogOpen}
        onClose={() => setIsActivateDialogOpen(false)}
        onConfirm={handleConfirmActivate}
        isActivating={isActivating}
      />
    </div>
  );
};
