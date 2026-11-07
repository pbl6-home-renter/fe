import { useCallback, useMemo, useSyncExternalStore } from 'react';

const objectUrls = new WeakMap<File, { url: string; refs: number }>();

const subscribeFileUrl = (file?: File) => () => {
  if (!file) return () => {};
  const entry = objectUrls.get(file) ?? { url: URL.createObjectURL(file), refs: 0 };
  entry.refs += 1;
  objectUrls.set(file, entry);

  return () => {
    entry.refs -= 1;
    if (entry.refs === 0) {
      URL.revokeObjectURL(entry.url);
      objectUrls.delete(file);
    }
  };
};

export const useChatLocalImagePreview = (file?: File) => {
  const subscribe = useMemo(() => subscribeFileUrl(file), [file]);
  const getSnapshot = useCallback(() => (file ? objectUrls.get(file)?.url : undefined), [file]);
  return useSyncExternalStore(subscribe, getSnapshot);
};
