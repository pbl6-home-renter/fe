import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { issueUpdateSchema, type IssueUpdateFormValues } from '../forms/issue-update.schema';
import type { IssueDetail } from '../types/issue.dto';
import { useIssueUpdateMutation } from './use-issue-update-mutation';

export const useIssueEditForm = (issue: IssueDetail, onClose: () => void) => {
  const form = useForm<IssueUpdateFormValues>({
    resolver: zodResolver(issueUpdateSchema),
    defaultValues: {
      assignedTo: issue.assignedTo ?? '',
      repairCost: issue.repairCost === null ? '' : String(issue.repairCost),
      resolutionNote: issue.resolutionNote ?? '',
    },
  });
  const mutation = useIssueUpdateMutation(issue.id);
  const onSubmit = form.handleSubmit((values) =>
    mutation.mutate(
      {
        assignedTo: values.assignedTo || null,
        repairCost: values.repairCost === '' ? null : Number(values.repairCost),
        resolutionNote: values.resolutionNote || null,
      },
      { onSuccess: onClose },
    ),
  );
  return { form, onSubmit, isSubmitting: mutation.isPending };
};
