// Hand-copied from api-docs `MediaPresignUploadRequestDto` / `MediaPresignUploadResponseDto`
// / `MediaCompleteUploadResponseDto`. Keep in sync when the contract changes.

export const MediaOwnerType = {
  USER: 'user',
  ROOM: 'room',
  BUILDING: 'building',
  CONTRACT: 'contract',
  CONTRACT_MEMBER: 'contract_member',
  METER_READING: 'meter_reading',
  ISSUE_REPORT: 'issue_report',
  MESSAGE: 'message',
} as const;

export type MediaOwnerType = (typeof MediaOwnerType)[keyof typeof MediaOwnerType];

export const MediaPurpose = {
  AVATAR: 'avatar',
  COVER_PHOTO: 'cover_photo',
  GALLERY_PHOTO: 'gallery_photo',
  OWNERSHIP_PROOF: 'ownership_proof',
  CCCD_FRONT: 'cccd_front',
  CCCD_BACK: 'cccd_back',
  CONTRACT_TEMPLATE: 'contract_template',
  CONTRACT_SIGNED: 'contract_signed',
  METER_READING_EVIDENCE: 'meter_reading_evidence',
  ISSUE_PHOTO: 'issue_photo',
  CHAT_ATTACHMENT: 'chat_attachment',
} as const;

export type MediaPurpose = (typeof MediaPurpose)[keyof typeof MediaPurpose];

export const MediaContentType = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  PDF: 'application/pdf',
} as const;

export type MediaContentType = (typeof MediaContentType)[keyof typeof MediaContentType];

export const MediaCaptureSource = {
  CAMERA_DIRECT: 'camera_direct',
  DEVICE_STORAGE: 'device_storage',
} as const;

export type MediaCaptureSource = (typeof MediaCaptureSource)[keyof typeof MediaCaptureSource];

export type MediaFileType = 'image' | 'document' | 'video' | 'other';

export type MediaVisibility = 'public' | 'private';

export interface MediaPresignUploadRequestDto {
  ownerType: MediaOwnerType;
  ownerId: string;
  purpose: MediaPurpose;
  /** 1–255 chars; the extension must match `contentType`. */
  fileName: string;
  contentType: MediaContentType;
  /** Bytes; must equal the size of the file PUT to storage. */
  size: number;
  captureSource?: MediaCaptureSource | null;
}

export interface MediaPresignUploadResponseDto {
  id: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  purpose: MediaPurpose;
  uploadUrl: string;
  requiredHeaders: { 'Content-Type': MediaContentType };
  /** Seconds until `uploadUrl` and the ticket expire. */
  expiresIn: number;
}

export interface MediaCompleteUploadResponseDto {
  id: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  purpose: MediaPurpose;
  fileType: MediaFileType;
  /** Absolute R2 URL for public purposes, `/api/v1/media/{id}` for private ones. */
  url: string;
}
