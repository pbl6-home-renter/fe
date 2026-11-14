import { z } from 'zod';

export const issueUpdateSchema = z.object({
  assignedTo: z.string().trim().max(500),
  repairCost: z
    .string()
    .regex(/^\d*$/, 'invalidCost')
    .refine((value) => value === '' || Number(value) <= 2147483647, 'invalidCost'),
  resolutionNote: z.string().trim().max(500),
});
export type IssueUpdateFormValues = z.infer<typeof issueUpdateSchema>;
