import { http } from '@/lib/api/http';
import type {
  AppealAdminDetailDto,
  AppealAdminListItemDto,
  AppealCurrentResponseDto,
  AppealListParams,
  AppealRejectRequestDto,
  AppealResponseDto,
  AppealReviewResponseDto,
  AppealSubmitRequestDto,
  ReportAdminDetailDto,
  ReportAdminListItemDto,
  ReportListParams,
  ReportResolveRequestDto,
  ReportResolveResponseDto,
  ReportResponseDto,
  ReportSubmitRequestDto,
} from '../types/moderation.dto';

/** Drops empty values so the backend never receives `status=` or `userId=undefined`. */
const compactParams = <T extends object>(params?: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>;

export const moderationApi = {
  getMyCurrentAppeal: () => http.get<AppealCurrentResponseDto>('/me/appeals/current'),

  submitMyAppeal: (body: AppealSubmitRequestDto) => http.post<AppealResponseDto>('/me/appeals', body),

  getAppeals: (params?: AppealListParams) =>
    http.getPageWithParams<AppealAdminListItemDto, Partial<AppealListParams>>('/appeals', compactParams(params)),

  getAppealById: (appealId: string) => http.get<AppealAdminDetailDto>(`/appeals/${appealId}`),

  acceptAppeal: (appealId: string) => http.post<AppealReviewResponseDto>(`/appeals/${appealId}/accept`),

  rejectAppeal: (appealId: string, body: AppealRejectRequestDto) =>
    http.post<AppealReviewResponseDto>(`/appeals/${appealId}/reject`, body),

  submitReport: (body: ReportSubmitRequestDto) => http.post<ReportResponseDto>('/reports', body),

  getReports: (params?: ReportListParams) =>
    http.getPageWithParams<ReportAdminListItemDto, Partial<ReportListParams>>('/reports', compactParams(params)),

  getReportById: (reportId: string) => http.get<ReportAdminDetailDto>(`/reports/${reportId}`),

  resolveReport: (reportId: string, body: ReportResolveRequestDto) =>
    http.post<ReportResolveResponseDto>(`/reports/${reportId}/resolve`, body),
};
