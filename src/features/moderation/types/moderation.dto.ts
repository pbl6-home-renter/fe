// Hand-copied from api-docs `schemas/moderation/*` and `requests/moderation/*`.
import type {
  AppealStatus,
  ReportCategory,
  ReportContextType,
  ReportResolveAction,
  ReportStatus,
} from '../enums/moderation.enum';

export interface ModerationUserSummaryDto {
  id: string;
  name: string | null;
  email: string | null;
  role: 'tenant' | 'landlord' | 'admin' | null;
  status: 'pending_verification' | 'active' | 'locked' | null;
}

// ---- Appeals ----

export interface AppealResponseDto {
  id: string;
  status: AppealStatus;
  content: string;
  attachmentMediaIds: string[];
  contactEmail: string | null;
  contactPhone: string | null;
  rejectReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface AppealCurrentResponseDto {
  lockReason: string | null;
  lockedAt: string | null;
  appeal: AppealResponseDto | null;
  canSubmit: boolean;
  nextSubmitAt: string | null;
}

export interface AppealSubmitRequestDto {
  content: string;
  attachmentMediaIds?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface AppealAdminListItemDto {
  id: string;
  user: ModerationUserSummaryDto;
  lockReason: string | null;
  lockedAt: string;
  content: string;
  attachmentCount: number;
  status: AppealStatus;
  createdAt: string;
  reviewedAt: string | null;
}

export interface AppealAdminDetailDto extends AppealAdminListItemDto {
  attachmentMediaIds: string[];
  contactEmail: string | null;
  contactPhone: string | null;
  rejectReason: string | null;
  reviewedBy: ModerationUserSummaryDto | null;
}

export interface AppealListParams {
  status?: AppealStatus;
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface AppealRejectRequestDto {
  rejectReason: string;
}

export interface AppealReviewResponseDto {
  id: string;
  status: AppealStatus;
  userId: string;
  unlocked: boolean;
}

// ---- Reports ----

export interface ReportSubmitRequestDto {
  reportedUserId: string;
  category: ReportCategory;
  description: string;
  evidenceMediaIds?: string[];
  contextType?: ReportContextType;
  contextId?: string;
}

export interface ReportResponseDto {
  id: string;
  reportedUserId: string;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportAdminListItemDto {
  id: string;
  reporter: ModerationUserSummaryDto;
  reportedUser: ModerationUserSummaryDto;
  category: ReportCategory;
  description: string;
  evidenceCount: number;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ReportAdminDetailDto extends ReportAdminListItemDto {
  evidenceMediaIds: string[];
  contextType: ReportContextType | null;
  contextId: string | null;
  resolutionNote: string | null;
  resolvedBy: ModerationUserSummaryDto | null;
}

export interface ReportListParams {
  status?: ReportStatus;
  category?: ReportCategory;
  reportedUserId?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface ReportResolveRequestDto {
  action: ReportResolveAction;
  note?: string;
  lockReason?: string;
}

export interface ReportResolveResponseDto {
  id: string;
  status: ReportStatus;
  reportedUserId: string;
  locked: boolean;
}
