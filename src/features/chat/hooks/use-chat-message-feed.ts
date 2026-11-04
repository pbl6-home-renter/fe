import { useCallback, useEffect, useRef } from 'react';
import { CHAT_FEED_BOTTOM_THRESHOLD_PX, CHAT_FEED_OLDER_THRESHOLD_PX } from '../constants/chat.constants';

interface UseChatMessageFeedOptions {
  messageCount: number;
  pendingCount: number;
  isError: boolean;
  isLoadingOlder: boolean;
  hasOlder: boolean;
  onLoadOlder: () => void;
  onLatestVisible: () => void;
  onAtBottomChange: (atBottom: boolean) => void;
}

export const useChatMessageFeed = ({
  messageCount,
  pendingCount,
  isError,
  isLoadingOlder,
  hasOlder,
  onLoadOlder,
  onLatestVisible,
  onAtBottomChange,
}: UseChatMessageFeedOptions) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const wasAtBottom = useRef(true);
  const previousHeight = useRef(0);
  const preservePosition = useRef(false);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    if (preservePosition.current) {
      feed.scrollTop += feed.scrollHeight - previousHeight.current;
      preservePosition.current = false;
      previousHeight.current = 0;
    } else if (wasAtBottom.current) {
      feed.scrollTop = feed.scrollHeight;
      if (messageCount && document.visibilityState === 'visible') onLatestVisible();
    }
  }, [messageCount, onLatestVisible]);

  useEffect(() => {
    if (isError && !isLoadingOlder) {
      preservePosition.current = false;
      previousHeight.current = 0;
    }
  }, [isError, isLoadingOlder]);

  useEffect(() => {
    const feed = feedRef.current;
    if (feed && wasAtBottom.current && pendingCount) feed.scrollTop = feed.scrollHeight;
  }, [pendingCount]);

  const loadOlder = useCallback(() => {
    const feed = feedRef.current;
    if (feed) {
      previousHeight.current = feed.scrollHeight;
      preservePosition.current = true;
    }
    onLoadOlder();
  }, [onLoadOlder]);

  const handleScroll = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return;
    wasAtBottom.current = feed.scrollHeight - feed.scrollTop - feed.clientHeight < CHAT_FEED_BOTTOM_THRESHOLD_PX;
    onAtBottomChange(wasAtBottom.current);
    if (feed.scrollTop < CHAT_FEED_OLDER_THRESHOLD_PX && hasOlder && !isLoadingOlder) loadOlder();
    if (wasAtBottom.current) onLatestVisible();
  }, [hasOlder, isLoadingOlder, loadOlder, onAtBottomChange, onLatestVisible]);

  const jumpLatest = useCallback(() => {
    const feed = feedRef.current;
    if (feed) {
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
      wasAtBottom.current = true;
    }
  }, []);

  return { feedRef, handleScroll, loadOlder, jumpLatest };
};
