import { z } from 'zod';
import { MEDIA_ERROR_CODES } from '../constants/media.constants';
import type { MediaPurpose } from '../types/media.dto';
import { validateMediaFile } from '../utils/upload-media';

/**
 * Schema for a single file field. Error messages are media error codes;
 * render them with `getApiErrorMessage(error.message)`.
 */
export const createMediaFileSchema = (purpose: MediaPurpose) =>
  z
    .instanceof(File, { message: MEDIA_ERROR_CODES.MEDIA_FILE_REQUIRED })
    .superRefine((file, ctx) => {
      const code = validateMediaFile(file, purpose);
      if (code) {
        ctx.addIssue({ code: 'custom', message: code });
      }
    });

/** Schema for a multi-file field (e.g. gallery photos). */
export const createMediaFilesSchema = (purpose: MediaPurpose, minFiles = 0) =>
  z.array(createMediaFileSchema(purpose)).min(minFiles, MEDIA_ERROR_CODES.MEDIA_FILE_REQUIRED);
