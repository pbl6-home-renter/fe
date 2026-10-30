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
