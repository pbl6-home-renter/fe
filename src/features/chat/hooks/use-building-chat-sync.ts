import { useEffect, useRef } from 'react';
import { chatApi } from '../api/chat.api';
import { fetchBuildingActiveTenantIds } from '@/features/buildings/utils/building-chat.utils';

interface UseBuildingChatSyncOptions {
  conversationId?: string;
  buildingId?: string | null;
  canSync?: boolean;
  onSynced?: () => void;
}

export const useBuildingChatSync = ({ conversationId, buildingId, canSync, onSynced }: UseBuildingChatSyncOptions) => {
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || !buildingId || !canSync) return;
    const syncKey = `${conversationId}:${buildingId}`;
    if (syncedRef.current === syncKey) return;

    let isMounted = true;
    void (async () => {
      try {
        const [convDetail, residentUserIds] = await Promise.all([
          chatApi.getConversation(conversationId),
          fetchBuildingActiveTenantIds(buildingId),
        ]);
        if (!isMounted) return;

        const residentIdSet = new Set(residentUserIds.map((id) => id.toLowerCase()));
        let didMutate = false;

        // Remove members who do not live in this building
        const nonResidentsToRemove = convDetail.members
          .filter(
            (m) =>
              m.participantType === 'user' &&
              m.role !== 'admin' &&
              m.status === 'active' &&
              m.userId &&
              !residentIdSet.has(m.userId.toLowerCase()),
          )
          .map((m) => m.userId as string);

        for (const userId of nonResidentsToRemove) {
          try {
            await chatApi.removeMember(conversationId, userId);
            didMutate = true;
          } catch {
            // Non-fatal member removal
          }
        }

        // Add missing active residents of this building
        const activeChatUserIds = new Set(
          convDetail.members
            .filter((m) => m.status === 'active' && m.userId && !nonResidentsToRemove.includes(m.userId))
            .map((m) => m.userId!.toLowerCase()),
        );
        const missingUserIds = residentUserIds.filter((id) => !activeChatUserIds.has(id.toLowerCase()));

        if (missingUserIds.length > 0) {
          try {
            await chatApi.addMembers(conversationId, { userIds: missingUserIds });
            didMutate = true;
          } catch {
            // Non-fatal member addition
          }
        }

        if (isMounted) {
          syncedRef.current = syncKey;
          if (didMutate) {
            onSynced?.();
          }
        }
      } catch {
        // Silent sync failure
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [conversationId, buildingId, canSync, onSynced]);
};
