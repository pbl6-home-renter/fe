import type { ListParams } from '@/types/api';

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled';
export type IssueCategory = 'PLUMBING' | 'ELECTRICAL' | 'APPLIANCE' | 'STRUCTURAL' | 'SECURITY' | 'OTHER';
export type IssueUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export interface IssueFilter {
  roomId?: string;
  buildingId?: string;
  status?: IssueStatus;
}
export type IssueListParams = ListParams<IssueFilter>;

export interface IssueListItem {
  id: string;
  roomId: string;
  buildingId: string;
  reporterId: string;
  roomName: string;
  buildingName: string;
  title: string;
  description: string | null;
  category: IssueCategory;
  urgency: IssueUrgency;
  status: IssueStatus;
  createdAt: string;
}
export interface IssueDetail extends IssueListItem {
  contractId: string;
  issuePhotoMediaIds: string[];
  assignedTo: string | null;
  repairCost: number | null;
  resolutionNote: string | null;
  closedAt: string | null;
  canUpdate: boolean;
  canCancel: boolean;
  canUploadPhotos: boolean;
}
export interface IssueCreateRequest {
  roomId: string;
  title: string;
  description: string | null;
  category: IssueCategory;
  urgency: IssueUrgency;
}
export interface IssueCreateResult {
  id: string;
  status: IssueStatus;
  title: string;
}
export interface IssueUpdateRequest {
  status?: 'in_progress' | 'resolved';
  assignedTo?: string | null;
  repairCost?: number | null;
  resolutionNote?: string | null;
}
export interface IssueActionResult {
  id: string;
  status: IssueStatus;
  closedAt: string | null;
}
