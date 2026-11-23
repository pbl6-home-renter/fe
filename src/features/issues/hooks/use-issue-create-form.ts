import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ContractStatus } from '@/features/contracts/enums/contract-status.enum';
import { useContractsQuery } from '@/features/contracts/hooks/use-contracts-query';
import { useMyContractsQuery } from '@/features/contracts/hooks/use-my-contracts-query';
import { issueCreateSchema, type IssueCreateFormValues } from '../forms/issue-create.schema';
import { useIssueCreateMutation } from './use-issue-create-mutation';

export const useIssueCreateForm = (tenant: boolean, onCreated: (id: string) => void) => {
  // Room picker loads all active contracts at once (same as other option lists), so it needs no pagination.
  const params = { pageSize: 100, filter: { status: ContractStatus.ACTIVE } };
  const landlordContracts = useContractsQuery(params, !tenant);
  const tenantContracts = useMyContractsQuery(params, { enabled: tenant });
  const contracts = tenant ? tenantContracts : landlordContracts;
  const form = useForm<IssueCreateFormValues>({
    resolver: zodResolver(issueCreateSchema),
    defaultValues: { roomId: '', title: '', description: '', category: 'OTHER', urgency: 'MEDIUM' },
  });
  const mutation = useIssueCreateMutation();
  const options = (contracts.data?.items ?? []).map((item) => ({
    value: item.roomId,
    label: 'buildingName' in item ? `${item.buildingName} · ${item.roomName}` : item.roomName,
  }));
  const onSubmit = form.handleSubmit((values) =>
    mutation.mutate(
      { ...values, description: values.description || null },
      {
        onSuccess: (result) => onCreated(result.id),
      },
    ),
  );
  return { form, contracts, options, onSubmit, isSubmitting: mutation.isPending };
};
