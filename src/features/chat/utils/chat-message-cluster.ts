import type { ChatMessage } from '../types/chat.dto';

const CLUSTER_GAP_MS = 5 * 60_000;

/** Consecutive messages from the same sender within five minutes on the same day render as one cluster. */
export const isSameCluster = (earlier?: ChatMessage, later?: ChatMessage): boolean => {
  if (!earlier || !later || earlier.type === 'system' || later.type === 'system') return false;
  const earlierTime = new Date(earlier.createdAt);
  const laterTime = new Date(later.createdAt);
  return (
    earlier.senderUserId === later.senderUserId &&
    earlier.senderType === later.senderType &&
    earlier.senderName === later.senderName &&
    laterTime.getTime() - earlierTime.getTime() < CLUSTER_GAP_MS &&
    laterTime.toDateString() === earlierTime.toDateString()
  );
};
