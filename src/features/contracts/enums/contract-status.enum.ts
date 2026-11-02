export const ContractStatus = {
  DRAFT: 'draft',
  SIGNED: 'signed',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
} as const;

export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];
