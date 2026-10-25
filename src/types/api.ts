export type HttpStatusCode =
  | 200 
  | 201 
  | 202 
  | 204 
  | 400 
  | 401 
  | 403 
  | 404 
  | 409 
  | 422 
  | 429 
  | 500; 

export type SuccessStatusCode = 200 | 201 | 202 | 204;
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500;

export interface ApiResponse<T> {
  statusCode: number;
  code: string;
  data: T;
}

export type NoContent = void;
export type NoContentResponse = void;

export interface ApiErrorResponse {
  statusCode: ErrorStatusCode | number;
  code: string;
}

export type ApiError = ApiErrorResponse;

export interface BadRequestErrorResponse extends ApiErrorResponse {
  statusCode: 400;
  code: 'BAD_REQUEST';
}

export interface UnauthorizedErrorResponse extends ApiErrorResponse {
  statusCode: 401;
  code: 'UNAUTHORIZED' | 'INVALID_CREDENTIALS';
}

export interface ForbiddenErrorResponse extends ApiErrorResponse {
  statusCode: 403;
  code: 'FORBIDDEN';
}

export interface ValidationErrorResponse extends ApiErrorResponse {
  statusCode: 422;
  code: 'VALIDATION_FAILED' | 'UNPROCESSABLE_ENTITY';
}

export interface InternalServerErrorResponse extends ApiErrorResponse {
  statusCode: 500;
  code: 'INTERNAL_SERVER_ERROR';
}

export interface OffsetPaginationMeta {
  type: 'offset';
  pageNo: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginationMeta = OffsetPaginationMeta;

export interface OffsetPaginationParams {
  pageNo?: number;
  pageSize?: number;
}

export type PaginationQueryParams = OffsetPaginationParams;

export interface PaginatedResponse<T> {
  statusCode: number;
  code: string;
  data: T[];
  pagination: OffsetPaginationMeta;
}

export type SuccessListResponse<T> = PaginatedResponse<T>;

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export type ExportFormat = 'json' | 'xlsx' | 'csv' | 'pdf';

export type ResponseContentType = 'json' | 'blob';

export const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof (value as { statusCode: unknown }).statusCode === 'number' &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'string' &&
    'data' in value
  );
};

export const isPaginatedResponse = <T>(value: unknown): value is PaginatedResponse<T> => {
  if (!isApiResponse<T[]>(value)) {
    return false;
  }
  const candidate = value as unknown as { pagination?: unknown };
  return (
    Array.isArray((value as ApiResponse<unknown>).data) &&
    typeof candidate.pagination === 'object' &&
    candidate.pagination !== null &&
    (candidate.pagination as { type?: unknown }).type === 'offset'
  );
};

export const isApiError = (value: unknown): value is ApiError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof (value as { statusCode: unknown }).statusCode === 'number' &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'string' &&
    !('data' in value)
  );
};

export const isOffsetPaginationMeta = (value: unknown): value is OffsetPaginationMeta => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const meta = value as Record<string, unknown>;
  return (
    meta.type === 'offset' &&
    typeof meta.pageNo === 'number' &&
    typeof meta.pageSize === 'number' &&
    typeof meta.totalItems === 'number' &&
    typeof meta.totalPages === 'number' &&
    typeof meta.hasNextPage === 'boolean' &&
    typeof meta.hasPreviousPage === 'boolean'
  );
};
