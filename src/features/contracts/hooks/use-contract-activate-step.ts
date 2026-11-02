import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivateContractMutation } from './use-activate-contract-mutation';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { validateMediaFile } from '@/features/media/utils/upload-media';
import { ContractStatus } from '../enums/contract-status.enum';
import type { ContractDetailDto } from '../types/contract.dto';

interface UseContractActivateStepOptions {
  contract: ContractDetailDto;
  onRefresh: () => void;
}

export const useContractActivateStep = ({
  contract,
  onRefresh,
}: UseContractActivateStepOptions) => {
  const { t } = useTranslation('contracts');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signedMediaId, setSignedMediaId] = useState<string | null>(
    contract.signedContractMediaId || null
  );
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isActive = contract.status === ContractStatus.ACTIVE;

  const activateMutation = useActivateContractMutation({
    onSuccess: () => {
      setIsActivateDialogOpen(false);
      onRefresh();
    },
  });

  const mediaUpload = useMediaUpload({
    onSuccess: (data) => {
      setSignedMediaId(data.id);
      setUploadError(null);
    },
  });

  const signedPdfObject = useMediaObjectUrl(
    signedMediaId ? `/api/v1/media/${signedMediaId}` : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateMediaFile(file, 'contract_signed');
    if (validationError) {
      setUploadError(t('detail.step3UploadFileError'));
      return;
    }

    setUploadError(null);
    mediaUpload.upload({
      file,
      ownerType: 'contract',
      ownerId: contract.id,
      purpose: 'contract_signed',
    });
  };

  const handleConfirmActivate = () => {
    if (!signedMediaId) return;
    activateMutation.mutate({
      id: contract.id,
      payload: { signedContractMediaId: signedMediaId },
    });
  };

  return {
    signedMediaId,
    isActivateDialogOpen,
    setIsActivateDialogOpen,
    uploadError,
    fileInputRef,
    isActive,
    isActivating: activateMutation.isPending,
    isUploading: mediaUpload.isUploading,
    uploadProgress: mediaUpload.progress,
    signedPdfObject,
    handleFileChange,
    handleConfirmActivate,
  };
};
