import { z } from 'zod';

export const issueCreateSchema = z.object({
  roomId: z.string().uuid('required'),
  title: z.string().trim().min(1, 'required').max(255),
  description: z.string().trim().max(500),
  category: z.enum(['PLUMBING', 'ELECTRICAL', 'APPLIANCE', 'STRUCTURAL', 'SECURITY', 'OTHER']),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']),
});

export type IssueCreateFormValues = z.infer<typeof issueCreateSchema>;
