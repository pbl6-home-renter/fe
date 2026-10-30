import axios from 'axios';
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  MediaCompleteUploadResponseDto,
  MediaPresignUploadRequestDto,
  MediaPresignUploadResponseDto,
} from '../types/media.dto';

export interface MediaRequestOptions {
  signal?: AbortSignal;
}

export interface MediaStorageUploadOptions extends MediaRequestOptions {
  /** 0–100 */
  onProgress?: (percent: number) => void;
}

export const mediaApi = {
  presignUpload: async (
    payload: MediaPresignUploadRequestDto,
    options?: MediaRequestOptions
  ): Promise<MediaPresignUploadResponseDto> => {
    return apiClient.post<ApiResponse<MediaPresignUploadResponseDto>, MediaPresignUploadResponseDto>(
      '/media/presign-upload',
      payload,
      { signal: options?.signal }
    );
  },

  /**
   * PUTs the raw file to the presigned storage URL. Uses plain `axios`, not
   * `apiClient`: storage must not receive the Bearer token or JSON header, and
   * its 401/403 must not trigger the session refresh flow.
   */
  putToStorage: async (
    uploadUrl: string,
    file: Blob,
    headers: Record<string, string>,
    options?: MediaStorageUploadOptions
  ): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers,
      signal: options?.signal,
      onUploadProgress: (event) => {
        const total = event.total ?? file.size;
        if (options?.onProgress && total > 0) {
          options.onProgress(Math.min(100, Math.round((event.loaded / total) * 100)));
        }
      },
    });
  },

  completeUpload: async (
    mediaId: string,
    options?: MediaRequestOptions
  ): Promise<MediaCompleteUploadResponseDto> => {
    return apiClient.post<
      ApiResponse<MediaCompleteUploadResponseDto>,
      MediaCompleteUploadResponseDto
    >(`/media/${mediaId}/complete-upload`, undefined, { signal: options?.signal });
  },

  /** Streams a private file (needs the Bearer token, so it can't be an `<img src>`). */
  getBlob: async (mediaId: string, options?: MediaRequestOptions): Promise<Blob> => {
    return apiClient.get<Blob, Blob>(`/media/${mediaId}`, {
      responseType: 'blob',
      signal: options?.signal,
    });
  },

  delete: async (mediaId: string): Promise<void> => {
    return apiClient.delete<void, void>(`/media/${mediaId}`);
  },
};
