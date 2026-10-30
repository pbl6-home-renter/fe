import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppMutation, type UseAppMutationOptions } from '@/lib/react-query';
import { MEDIA_SUCCESS_CODES } from '../../constants/media.constants';
import type { MediaCompleteUploadResponseDto } from '../../types/media.dto';
import { uploadMedia, type UploadMediaParams } from '../../utils/upload-media';

export type MediaUploadVariables = Omit<UploadMediaParams, 'signal'>;

/**
 * Presign → PUT → complete as one mutation, with progress and cancel.
 * Several uploads may run at once; `progress` tracks the latest one and
 * `cancel()` aborts all of them.
 */
export const useMediaUpload = (
  options?: Partial<
    UseAppMutationOptions<MediaCompleteUploadResponseDto, Error, MediaUploadVariables>
  >
) => {
  const [progress, setProgress] = useState(0);
  const controllersRef = useRef(new Set<AbortController>());

  const mutation = useAppMutation<MediaCompleteUploadResponseDto, Error, MediaUploadVariables>({
    mutationFn: async (variables) => {
      const controller = new AbortController();
      controllersRef.current.add(controller);
      setProgress(0);
      try {
        return await uploadMedia({
          ...variables,
          signal: controller.signal,
          onProgress: (percent) => {
            setProgress(percent);
            variables.onProgress?.(percent);
          },
        });
      } finally {
        controllersRef.current.delete(controller);
      }
    },
    successCode: MEDIA_SUCCESS_CODES.MEDIA_UPLOAD_COMPLETED,
    ...options,
  });

  const cancel = useCallback(() => {
    controllersRef.current.forEach((controller) => controller.abort());
    controllersRef.current.clear();
  }, []);

  const { reset: resetMutation } = mutation;
  const reset = useCallback(() => {
    cancel();
    setProgress(0);
    resetMutation();
  }, [cancel, resetMutation]);

  // Don't keep uploading after the screen is gone.
  useEffect(() => cancel, [cancel]);

  return {
    ...mutation,
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    progress,
    cancel,
    reset,
  };
};
