export type UploadItemStatus = 'uploading' | 'completed' | 'error';

export interface UploadedMediaItem {
  id: string;
  file: File;
  mediaId?: string;
  status: UploadItemStatus;
  errorMessage?: string;
}

export interface OwnershipProofUploaderProps {
  mediaIds?: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}
