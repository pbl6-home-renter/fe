/**
 * Rentify API Response Conventions & Types
 * Reference: API Conventions §1 (Response Wrapper), §2 (Pagination), §3 (Error Codes)
 */

export interface ApiResponse<T> {
  statusCode: number;
  code: string;
  message?: string;
  data: T;
}

export interface OffsetPaginationMeta {
  type?: 'offset';
  pageNo?: number;
  pageSize?: number;
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface CursorPaginationMeta {
  type: 'cursor';
  pageSize: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type PaginationMeta = OffsetPaginationMeta | CursorPaginationMeta;

export interface PaginatedResponse<T> extends Partial<ApiResponse<T[]>> {
  data?: T[];
  items?: T[];
  pagination?: PaginationMeta;
  meta?: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
}
