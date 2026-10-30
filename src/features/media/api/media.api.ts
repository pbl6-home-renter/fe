import axios, { type AxiosRequestConfig } from 'axios';
import { http } from '@/lib/api/http';
import type {
  MediaCompleteUploadResponseDto,
  MediaPresignUploadRequestDto,
  MediaPresignUploadResponseDto,
} from '../types/media.dto';

export type MediaRequestOptions = Pick<
  AxiosRequestConfig,
  'signal' | 'skipSuccessToast' | 'skipErrorToast'
>;

export interface MediaStorageUploadOptions extends MediaRequestOptions {
  /** 0–100 */
  onProgress?: (percent: number) => void;
}

export const mediaApi = {
  presignUpload: (body: MediaPresignUploadRequestDto, options?: MediaRequestOptions) =>
    http.post<MediaPresignUploadResponseDto>('/media/presign-upload', body, options),

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

  completeUpload: (mediaId: string, options?: MediaRequestOptions) =>
    http.post<MediaCompleteUploadResponseDto>(
      `/media/${mediaId}/complete-upload`,
      undefined,
      options
    ),

  /**
   * Streams a private file (needs the Bearer token, so it can't be an `<img src>`).
   * No error toast: a broken image is shown by the component instead.
   */
  getBlob: (mediaId: string, options?: MediaRequestOptions) =>
    http.getBlob(`/media/${mediaId}`, { signal: options?.signal, skipErrorToast: true }),

  delete: (mediaId: string) => http.delete(`/media/${mediaId}`),
};
