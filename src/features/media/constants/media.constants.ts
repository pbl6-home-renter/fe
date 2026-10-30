import {
  MediaContentType,
  MediaOwnerType,
  MediaPurpose,
  type MediaVisibility,
} from '../types/media.dto';

/** Identity-Service default (`MEDIA_MAX_SIZE_BYTES`), same for every purpose. */
export const MEDIA_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const MEDIA_FILE_NAME_MAX_LENGTH = 255;

/** First extension is the one appended when a file name lacks a matching one. */
export const MEDIA_CONTENT_TYPE_EXTENSIONS: Readonly<Record<MediaContentType, readonly string[]>> = {
  [MediaContentType.JPEG]: ['jpg', 'jpeg'],
  [MediaContentType.PNG]: ['png'],
  [MediaContentType.WEBP]: ['webp'],
  [MediaContentType.PDF]: ['pdf'],
};

const IMAGE_CONTENT_TYPES = [
  MediaContentType.JPEG,
  MediaContentType.PNG,
  MediaContentType.WEBP,
] as const;

const IMAGE_AND_PDF_CONTENT_TYPES = [...IMAGE_CONTENT_TYPES, MediaContentType.PDF] as const;

export interface MediaPurposeRule {
  ownerTypes: readonly MediaOwnerType[];
  contentTypes: readonly MediaContentType[];
  visibility: MediaVisibility;
  /** Completing a new file replaces the previous one of the same owner. */
  singlePerOwner?: boolean;
}

/**
 * Client-side mirror of Identity-Service
 * `src/modules/media/domain/policies/media-purpose.policies.ts`, used to fail
 * fast before presigning. The backend stays the source of truth.
 */
export const MEDIA_PURPOSE_RULES: Readonly<Record<MediaPurpose, MediaPurposeRule>> = {
  [MediaPurpose.AVATAR]: {
    ownerTypes: [MediaOwnerType.USER],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'public',
    singlePerOwner: true,
  },
  [MediaPurpose.COVER_PHOTO]: {
    ownerTypes: [MediaOwnerType.BUILDING, MediaOwnerType.ROOM],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'public',
    singlePerOwner: true,
  },
  [MediaPurpose.GALLERY_PHOTO]: {
    ownerTypes: [MediaOwnerType.BUILDING, MediaOwnerType.ROOM],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'public',
  },
  [MediaPurpose.OWNERSHIP_PROOF]: {
    ownerTypes: [MediaOwnerType.BUILDING],
    contentTypes: IMAGE_AND_PDF_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.CCCD_FRONT]: {
    ownerTypes: [MediaOwnerType.USER, MediaOwnerType.CONTRACT_MEMBER],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.CCCD_BACK]: {
    ownerTypes: [MediaOwnerType.USER, MediaOwnerType.CONTRACT_MEMBER],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.CONTRACT_TEMPLATE]: {
    ownerTypes: [MediaOwnerType.CONTRACT],
    contentTypes: [MediaContentType.PDF],
    visibility: 'private',
  },
  [MediaPurpose.CONTRACT_SIGNED]: {
    ownerTypes: [MediaOwnerType.CONTRACT],
    contentTypes: IMAGE_AND_PDF_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.METER_READING_EVIDENCE]: {
    ownerTypes: [MediaOwnerType.METER_READING],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.ISSUE_PHOTO]: {
    ownerTypes: [MediaOwnerType.ISSUE_REPORT],
    contentTypes: IMAGE_CONTENT_TYPES,
    visibility: 'private',
  },
  [MediaPurpose.CHAT_ATTACHMENT]: {
    ownerTypes: [MediaOwnerType.MESSAGE],
    contentTypes: IMAGE_AND_PDF_CONTENT_TYPES,
    visibility: 'private',
  },
};

/** Value for `<input type="file" accept>` of a purpose. */
export const getMediaAccept = (purpose: MediaPurpose): string =>
  MEDIA_PURPOSE_RULES[purpose].contentTypes.join(',');

/** Matches the `url` complete-upload returns for private files. */
export const PRIVATE_MEDIA_URL_PATTERN = /\/media\/([0-9a-f-]{36})\/?$/i;

export const MEDIA_SUCCESS_CODES = {
  MEDIA_UPLOAD_TICKET_ISSUED: 'MEDIA_UPLOAD_TICKET_ISSUED',
  MEDIA_UPLOAD_COMPLETED: 'MEDIA_UPLOAD_COMPLETED',
} as const;

/** Backend codes plus client-only codes (`MEDIA_FILE_*`, `MEDIA_STORAGE_*`, `MEDIA_UPLOAD_CANCELED`). */
export const MEDIA_ERROR_CODES = {
  MEDIA_TYPE_NOT_ALLOWED: 'MEDIA_TYPE_NOT_ALLOWED',
  INVALID_PURPOSE: 'INVALID_PURPOSE',
  UPLOAD_NOT_COMPLETED: 'UPLOAD_NOT_COMPLETED',
  TICKET_EXPIRED: 'TICKET_EXPIRED',
  MEDIA_DELETED: 'MEDIA_DELETED',
  CANNOT_DELETE: 'CANNOT_DELETE',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MEDIA_FILE_REQUIRED: 'MEDIA_FILE_REQUIRED',
  MEDIA_FILE_EMPTY: 'MEDIA_FILE_EMPTY',
  MEDIA_FILE_TOO_LARGE: 'MEDIA_FILE_TOO_LARGE',
  MEDIA_STORAGE_UPLOAD_FAILED: 'MEDIA_STORAGE_UPLOAD_FAILED',
  MEDIA_UPLOAD_CANCELED: 'MEDIA_UPLOAD_CANCELED',
} as const;

export type MediaErrorCode = (typeof MEDIA_ERROR_CODES)[keyof typeof MEDIA_ERROR_CODES];
