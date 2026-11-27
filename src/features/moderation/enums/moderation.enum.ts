// Mirrors the api-docs `moderation` schemas (P13-D109).

export const ReportCategory = {
  FRAUD: 'fraud',
  FAKE_LISTING: 'fake_listing',
  HARASSMENT: 'harassment',
  SPAM: 'spam',
  IMPERSONATION: 'impersonation',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  OTHER: 'other',
} as const;

export type ReportCategory = (typeof ReportCategory)[keyof typeof ReportCategory];

export const REPORT_CATEGORY_VALUES: readonly ReportCategory[] = Object.values(ReportCategory);

export const isValidReportCategory = (value: string | null | undefined): value is ReportCategory =>
  Boolean(value && REPORT_CATEGORY_VALUES.includes(value as ReportCategory));

export const ReportStatus = {
  PENDING: 'pending',
  DISMISSED: 'dismissed',
  ACTIONED: 'actioned',
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const REPORT_STATUS_VALUES: readonly ReportStatus[] = Object.values(ReportStatus);

export const isValidReportStatus = (value: string | null | undefined): value is ReportStatus =>
  Boolean(value && REPORT_STATUS_VALUES.includes(value as ReportStatus));

export const AppealStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type AppealStatus = (typeof AppealStatus)[keyof typeof AppealStatus];

export const APPEAL_STATUS_VALUES: readonly AppealStatus[] = Object.values(AppealStatus);

export const isValidAppealStatus = (value: string | null | undefined): value is AppealStatus =>
  Boolean(value && APPEAL_STATUS_VALUES.includes(value as AppealStatus));

export const ReportContextType = {
  CONVERSATION: 'conversation',
  CONTRACT: 'contract',
} as const;

export type ReportContextType = (typeof ReportContextType)[keyof typeof ReportContextType];

export const ReportResolveAction = {
  DISMISS: 'dismiss',
  LOCK: 'lock',
} as const;

export type ReportResolveAction = (typeof ReportResolveAction)[keyof typeof ReportResolveAction];
