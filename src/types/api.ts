// Envelope shapes from api-docs `responses/wrappers/*` and `schemas/common/*`.

export interface ApiResponse<T> {
  statusCode: number;
  code: string;
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
}

export interface PaginationMeta {
  type: 'offset';
  pageNo: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/** What `http.getPage()` resolves to: the envelope already unwrapped. */
export interface Paginated<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface CursorPaginationMeta {
  type: 'cursor';
  pageSize: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CursorPaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: CursorPaginationMeta;
}

/** What `http.getCursorPage()` resolves to: the envelope already unwrapped. */
export interface CursorPaginated<T> {
  items: T[];
  pagination: CursorPaginationMeta;
}

export interface CursorPaginationParams {
  cursor?: string;
  pageSize?: number;
}

/** Common entity fields based on api-doc `common/base-entity.yaml`. */
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  pageNo?: number;
  pageSize?: number;
  sort?: string;
  order?: SortOrder;
}

/** Pagination params plus the endpoint's `filter[...]` (deepObject) fields. */
export type ListParams<TFilter extends object = Record<string, unknown>> = PaginationParams & {
  filter?: Partial<TFilter>;
};
