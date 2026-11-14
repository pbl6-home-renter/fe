import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import type {
  IssueActionResult,
  IssueCreateRequest,
  IssueCreateResult,
  IssueDetail,
  IssueFilter,
  IssueListItem,
  IssueListParams,
  IssueUpdateRequest,
} from '../types/issue.dto';

export const issueApi = {
  list: (tenant: boolean, params?: IssueListParams): Promise<Paginated<IssueListItem>> =>
    http.getPage<IssueListItem, IssueFilter>(tenant ? '/me/issues' : '/issues', params),
  detail: (id: string): Promise<IssueDetail> => http.get<IssueDetail>(`/issues/${id}`),
  create: (request: IssueCreateRequest): Promise<IssueCreateResult> => http.post<IssueCreateResult>('/issues', request),
  update: (id: string, request: IssueUpdateRequest): Promise<IssueActionResult> =>
    http.patch<IssueActionResult>(`/issues/${id}`, request),
  cancel: (id: string): Promise<IssueActionResult> => http.post<IssueActionResult>(`/issues/${id}/cancel`),
};
