import { isCancel } from 'axios';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/api-messages';
import { mediaApi } from '../api/media.api';
import {
  MEDIA_CONTENT_TYPE_EXTENSIONS,
  MEDIA_ERROR_CODES,
  MEDIA_FILE_NAME_MAX_LENGTH,
  MEDIA_MAX_SIZE_BYTES,
  MEDIA_PURPOSE_RULES,
  type MediaErrorCode,
} from '../constants/media.constants';
import type {
  MediaCaptureSource,
  MediaCompleteUploadResponseDto,
  MediaContentType,
  MediaOwnerType,
  MediaPurpose,
} from '../types/media.dto';

/**
 * Error raised by the client-side part of the upload flow. `message` is already
 * localized, so `getErrorMessage(error)` and toasts show it as is.
 */
export class MediaUploadError extends Error {
  readonly code: MediaErrorCode;

  constructor(code: MediaErrorCode, options?: { cause?: unknown }) {
    super(getApiErrorMessage(code), options);
    this.name = 'MediaUploadError';
    this.code = code;
  }
}

export interface UploadMediaParams {
  file: File;
  ownerType: MediaOwnerType;
  ownerId: string;
  purpose: MediaPurpose;
  /** Only meaningful for `meter_reading_evidence` (tenants must send `camera_direct`). */
  captureSource?: MediaCaptureSource | null;
  /** Storage PUT progress, 0–100. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  /** Don't toast "upload completed", e.g. when uploading a batch one by one. */
  skipSuccessToast?: boolean;
  /** Don't toast errors, e.g. when the form shows them inline. */
  skipErrorToast?: boolean;
}

/** Returns the error code the backend would reject this file with, or `null`. */
export const validateMediaFile = (file: File, purpose: MediaPurpose): MediaErrorCode | null => {
  if (file.size <= 0) {
    return MEDIA_ERROR_CODES.MEDIA_FILE_EMPTY;
  }
  if (file.size > MEDIA_MAX_SIZE_BYTES) {
    return MEDIA_ERROR_CODES.MEDIA_FILE_TOO_LARGE;
  }
  const allowed = MEDIA_PURPOSE_RULES[purpose].contentTypes as readonly string[];
  if (!allowed.includes(file.type)) {
    return MEDIA_ERROR_CODES.MEDIA_TYPE_NOT_ALLOWED;
  }
  return null;
};

/**
 * The backend requires the file name's extension to match `contentType` and at
 * most 255 chars. Camera/clipboard files often have no or a wrong extension,
 * so append the canonical one instead of failing.
 */
export const toUploadFileName = (fileName: string, contentType: MediaContentType): string => {
  const extensions = MEDIA_CONTENT_TYPE_EXTENSIONS[contentType];
  const dotIndex = fileName.lastIndexOf('.');
  const extension = dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '';
  const hasValidExtension = extensions.includes(extension);

  const suffix = `.${hasValidExtension ? extension : extensions[0]}`;
  const baseName = (hasValidExtension ? fileName.slice(0, dotIndex) : fileName).trim() || 'file';
  return baseName.slice(0, MEDIA_FILE_NAME_MAX_LENGTH - suffix.length) + suffix;
};

const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) {
    throw new MediaUploadError(MEDIA_ERROR_CODES.MEDIA_UPLOAD_CANCELED);
  }
};

const runUpload = async ({
  file,
  ownerType,
  ownerId,
  purpose,
  captureSource,
  onProgress,
  signal,
  skipSuccessToast,
  skipErrorToast,
}: UploadMediaParams): Promise<MediaCompleteUploadResponseDto> => {
  if (!MEDIA_PURPOSE_RULES[purpose].ownerTypes.includes(ownerType)) {
    throw new MediaUploadError(MEDIA_ERROR_CODES.INVALID_PURPOSE);
  }
  const invalidCode = validateMediaFile(file, purpose);
  if (invalidCode) {
    throw new MediaUploadError(invalidCode);
  }

  const contentType = file.type as MediaContentType;

  try {
    const ticket = await mediaApi.presignUpload(
      {
        ownerType,
        ownerId,
        purpose,
        fileName: toUploadFileName(file.name, contentType),
        contentType,
        size: file.size,
        ...(captureSource ? { captureSource } : {}),
      },
      { signal, skipErrorToast }
    );

    onProgress?.(0);
    try {
      await mediaApi.putToStorage(ticket.uploadUrl, file, ticket.requiredHeaders, {
        signal,
        onProgress,
      });
    } catch (error) {
      if (isCancel(error)) {
        throw error;
      }
      // Storage replies with S3 XML, not our envelope; give the UI one stable code.
      throw new MediaUploadError(MEDIA_ERROR_CODES.MEDIA_STORAGE_UPLOAD_FAILED, { cause: error });
    }

    throwIfAborted(signal);
    return await mediaApi.completeUpload(ticket.id, { signal, skipSuccessToast, skipErrorToast });
  } catch (error) {
    if (isCancel(error)) {
      throw new MediaUploadError(MEDIA_ERROR_CODES.MEDIA_UPLOAD_CANCELED, { cause: error });
    }
    throw error;
  }
};

/**
 * Full upload flow: validate → presign → PUT to storage → complete.
 * Resolves with the completed media; use its `id` in business APIs
 * (e.g. `photoMediaIds`) and its `url` to display the file.
 */
export const uploadMedia = async (
  params: UploadMediaParams
): Promise<MediaCompleteUploadResponseDto> => {
  try {
    return await runUpload(params);
  } catch (error) {
    // API errors are toasted by `apiClient`; the client-side ones are toasted here.
    const isClientError =
      error instanceof MediaUploadError && error.code !== MEDIA_ERROR_CODES.MEDIA_UPLOAD_CANCELED;
    if (isClientError && !params.skipErrorToast) {
      toast.error(error.message, { id: error.message });
    }
    throw error;
  }
};
