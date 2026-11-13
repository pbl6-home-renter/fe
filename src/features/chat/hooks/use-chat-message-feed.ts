import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  CHAT_BACK_TO_LATEST_GLIDE_PX,
  CHAT_FEED_BOTTOM_THRESHOLD_PX,
  CHAT_FEED_NEWER_THRESHOLD_PX,
  CHAT_FEED_OLDER_THRESHOLD_PX,
} from '../constants/chat.constants';

interface UseChatMessageFeedOptions {
  messageCount: number;
  pendingCount: number;
  isError: boolean;
  isLoadingOlder: boolean;
  hasOlder: boolean;
  onLoadOlder: () => void;
  onLatestVisible: () => void;
  onAtBottomChange: (atBottom: boolean) => void;
  highlightedMessageId?: string;
  /** The feed shows a window around an opened message instead of the live tail. */
  isAnchored?: boolean;
  hasNewer?: boolean;
  isLoadingNewer?: boolean;
  onLoadNewer?: () => void;
  /** Leaves the anchored window; `glide` animates the scroll to the bottom. */
  onBackToLatest?: (glide: boolean) => void;
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
  highlightedMessageId,
  isAnchored = false,
  hasNewer = false,
  isLoadingNewer = false,
  onLoadNewer,
  onBackToLatest,
}: UseChatMessageFeedOptions) => {
  const reducedMotion = useReducedMotion();
  const feedRef = useRef<HTMLDivElement>(null);
  const wasAtBottom = useRef(!isAnchored);
  const previousHeight = useRef(0);
  const preservePosition = useRef(false);
  const scrolledHighlight = useRef<string | undefined>(undefined);
  const wasAnchored = useRef(isAnchored);
  const glideToLatest = useRef(false);

  // Keep the viewport stable when older pages are prepended; follow the tail in live mode.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    if (preservePosition.current) {
      feed.scrollTop += feed.scrollHeight - previousHeight.current;
      preservePosition.current = false;
      previousHeight.current = 0;
    } else if (!isAnchored && wasAtBottom.current) {
      feed.scrollTop = feed.scrollHeight;
      if (messageCount && document.visibilityState === 'visible') onLatestVisible();
    }
  }, [isAnchored, messageCount, onLatestVisible]);

  useEffect(() => {
    const feed = feedRef.current;
    const leavingAnchor = wasAnchored.current && !isAnchored;
    wasAnchored.current = isAnchored;
    wasAtBottom.current = !isAnchored;
    onAtBottomChange(!isAnchored);
    if (isAnchored || !feed) return;
    feed.scrollTop = feed.scrollHeight;
    if (!leavingAnchor || !glideToLatest.current || reducedMotion) return;
    glideToLatest.current = false;
    const frame = window.requestAnimationFrame(() => {
      feed.scrollTop = Math.max(0, feed.scrollHeight - feed.clientHeight - CHAT_BACK_TO_LATEST_GLIDE_PX);
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isAnchored, onAtBottomChange, reducedMotion]);

  // Scroll to a highlighted message once, as soon as it is rendered.
  useEffect(() => {
    if (!highlightedMessageId) {
      scrolledHighlight.current = undefined;
      return;
    }
    if (scrolledHighlight.current === highlightedMessageId) return;
    const target = document.getElementById(`chat-message-${highlightedMessageId}`);
    if (!target) return;
    scrolledHighlight.current = highlightedMessageId;
    target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
    target.focus({ preventScroll: true });
  }, [highlightedMessageId, messageCount, reducedMotion]);

  // An opened window shorter than the viewport cannot be scrolled, so fill it right away.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || !isAnchored || !messageCount || isLoadingNewer) return;
    if (feed.scrollHeight - feed.clientHeight > CHAT_FEED_NEWER_THRESHOLD_PX) return;
    if (hasNewer) onLoadNewer?.();
    else onBackToLatest?.(false);
  }, [hasNewer, isAnchored, isLoadingNewer, messageCount, onBackToLatest, onLoadNewer]);

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
    const distanceToBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight;
    if (feed.scrollTop < CHAT_FEED_OLDER_THRESHOLD_PX && hasOlder && !isLoadingOlder) loadOlder();
    if (isAnchored) {
      if (distanceToBottom < CHAT_FEED_NEWER_THRESHOLD_PX && hasNewer && !isLoadingNewer) onLoadNewer?.();
      // Reached the newest message: hand over to the live feed without moving the viewport.
      else if (distanceToBottom < CHAT_FEED_BOTTOM_THRESHOLD_PX && !hasNewer && !isLoadingNewer) {
        onBackToLatest?.(false);
      }
      return;
    }
    wasAtBottom.current = distanceToBottom < CHAT_FEED_BOTTOM_THRESHOLD_PX;
    onAtBottomChange(wasAtBottom.current);
    if (wasAtBottom.current) onLatestVisible();
  }, [
    hasNewer,
    hasOlder,
    isAnchored,
    isLoadingNewer,
    isLoadingOlder,
    loadOlder,
    onAtBottomChange,
    onBackToLatest,
    onLatestVisible,
    onLoadNewer,
  ]);

  const jumpLatest = useCallback(() => {
    const feed = feedRef.current;
    if (feed) {
      feed.scrollTo({ top: feed.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
      wasAtBottom.current = true;
    }
  }, [reducedMotion]);

  const backToLatest = useCallback(() => {
    glideToLatest.current = true;
    onBackToLatest?.(true);
  }, [onBackToLatest]);

  return { feedRef, handleScroll, loadOlder, jumpLatest, backToLatest };
};
