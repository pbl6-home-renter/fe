import type { AuditLogAction } from '../enums/audit-log-action.enum';
import type { AuditLogEntityType } from '../enums/audit-log-entity-type.enum';
import type { AuditLogSourceService } from '../enums/audit-log-source-service.enum';

export interface AuditLogListItemDto {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId: string | null;
  sourceService: AuditLogSourceService;
  createdAt: string;
}

export interface AuditLogDetailDto extends AuditLogListItemDto {
  metadata: Record<string, unknown>;
}

export interface AuditLogListParams {
  action?: AuditLogAction;
  entityType?: AuditLogEntityType;
  actorId?: string;
  entityId?: string;
  from?: string;
  to?: string;
  pageNo?: number;
  pageSize?: number;
}
