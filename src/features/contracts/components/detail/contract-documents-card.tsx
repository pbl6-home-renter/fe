import { useTranslation } from 'react-i18next';
import { FileCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ContractStep1Template } from './contract-step1-template';
import { ContractStep2Draft } from './contract-step2-draft';
import { ContractStep3Activate } from './contract-step3-activate';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractDocumentsCardProps {
  contract: ContractDetailDto;
  onRefresh: () => void;
}

export const ContractDocumentsCard = ({
  contract,
  onRefresh,
}: ContractDocumentsCardProps) => {
  const { t } = useTranslation('contracts');

  return (
    <Card className="space-y-6 p-5">
      <div className="flex items-center gap-2 border-b border-rentify-divider pb-3">
        <FileCheck className="h-5 w-5 text-rentify-primary" />
        <h2 className="font-semibold text-rentify-text-primary">
          {t('detail.documentsTitle')}
        </h2>
      </div>

      <div className="space-y-6">
        <ContractStep1Template contract={contract} onRefresh={onRefresh} />
        <ContractStep2Draft key={`${contract.id}:${contract.templateKey ?? ''}`} contract={contract} />
        <ContractStep3Activate contract={contract} onRefresh={onRefresh} />
      </div>
    </Card>
  );
};
