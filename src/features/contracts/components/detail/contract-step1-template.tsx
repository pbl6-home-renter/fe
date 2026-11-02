import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown';
import { useContractTemplatesQuery } from '../../hooks/use-contract-templates-query';
import { useApplyContractTemplateMutation } from '../../hooks/use-apply-contract-template-mutation';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractStep1TemplateProps {
  contract: ContractDetailDto;
  onRefresh: () => void;
}

export const ContractStep1Template = ({
  contract,
  onRefresh,
}: ContractStep1TemplateProps) => {
  const { t } = useTranslation('contracts');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(
    contract.templateKey || ''
  );

  const isDraft = contract.status === ContractStatus.DRAFT;
  const templatesQuery = useContractTemplatesQuery();
  const applyTemplateMutation = useApplyContractTemplateMutation({
    onSuccess: () => {
      onRefresh();
    },
  });

  const handleApplyTemplate = () => {
    if (!selectedTemplateKey) return;
    applyTemplateMutation.mutate({
      id: contract.id,
      payload: { templateKey: selectedTemplateKey },
    });
  };

  const templateOptions: SelectOption[] = (templatesQuery.data?.items ?? []).map((tpl) => ({
    value: tpl.templateKey,
    label: `${tpl.title} (v${tpl.version})`,
  }));

  return (
    <div className="space-y-3 rounded-xl border border-rentify-divider p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-rentify-text-primary">
            {t('detail.step1Title')}
          </h3>
          <p className="text-xs text-rentify-text-secondary">
            {t('detail.step1Desc')}
          </p>
        </div>
        {contract.templateKey && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            {t('detail.step1Applied')} {contract.templateKey}
          </span>
        )}
      </div>

      {isDraft && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SelectDropdown
              options={templateOptions}
              placeholder={t('detail.step1SelectPlaceholder')}
              value={selectedTemplateKey}
              onChange={(e) => setSelectedTemplateKey(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            disabled={!selectedTemplateKey || applyTemplateMutation.isPending}
            isLoading={applyTemplateMutation.isPending}
            onClick={handleApplyTemplate}
          >
            {t('detail.step1ApplyBtn')}
          </Button>
        </div>
      )}
    </div>
  );
};
