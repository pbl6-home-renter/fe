import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { queryKeys, useAppQuery } from '@/lib/react-query';
import { mediaApi } from '../../api/media.api';
import { PRIVATE_MEDIA_URL_PATTERN } from '../../constants/media.constants';

/** Media id when `url` is a private `/api/v1/media/{id}` path, otherwise `null`. */
export const getPrivateMediaId = (url: string | null | undefined): string | null => {
  if (!url || /^https?:\/\//i.test(url)) {
    return null;
  }
  return PRIVATE_MEDIA_URL_PATTERN.exec(url)?.[1] ?? null;
};

// Object URLs shared by every component showing the same blob; revoked when the last one unmounts.
const objectUrls = new Map<Blob, { url: string; refs: number }>();

const subscribeObjectUrl = (blob: Blob | undefined) => () => {
  if (!blob) {
    return () => {};
  }
  const entry = objectUrls.get(blob) ?? { url: URL.createObjectURL(blob), refs: 0 };
  entry.refs += 1;
  objectUrls.set(blob, entry);

  return () => {
    entry.refs -= 1;
    if (entry.refs === 0) {
      URL.revokeObjectURL(entry.url);
      objectUrls.delete(blob);
    }
  };
};

/**
 * Turns a media `url` into something `<img src>` / `<iframe src>` can load.
 * Public URLs are returned as is; private ones are fetched with the Bearer
 * token and exposed as an object URL that is revoked on unmount.
 */
export const useMediaObjectUrl = (url: string | null | undefined) => {
  const mediaId = getPrivateMediaId(url);

  const query = useAppQuery<Blob, Error, Blob, ReturnType<typeof queryKeys.media.object>>({
    queryKey: queryKeys.media.object(mediaId ?? ''),
    queryFn: ({ signal }) => mediaApi.getBlob(mediaId as string, { signal }),
    enabled: !!mediaId,
    staleTime: Infinity,
    suppressErrorToast: true,
  });

  const blob = mediaId ? query.data : undefined;
  const subscribe = useMemo(() => subscribeObjectUrl(blob), [blob]);
  const getSnapshot = useCallback(() => (blob ? objectUrls.get(blob)?.url : undefined), [blob]);
  const objectUrl = useSyncExternalStore(subscribe, getSnapshot);

  return {
    src: mediaId ? objectUrl : (url ?? undefined),
    isLoading: !!mediaId && query.isLoading,
    error: query.error,
  };
};
