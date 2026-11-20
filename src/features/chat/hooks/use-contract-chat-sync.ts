import { useEffect, useRef } from 'react';
import { chatApi } from '../api/chat.api';
import { contractApi } from '@/features/contracts/api/contract.api';

interface UseContractChatSyncOptions {
  conversationId?: string;
  contractId?: string | null;
  canSync?: boolean;
  onSynced?: () => void;
}

export const useContractChatSync = ({ conversationId, contractId, canSync, onSynced }: UseContractChatSyncOptions) => {
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || !contractId || !canSync) return;
    const syncKey = `${conversationId}:${contractId}`;
    if (syncedRef.current === syncKey) return;

    let isMounted = true;
    void (async () => {
      try {
        const [convDetail, membersRes] = await Promise.all([
          chatApi.getConversation(conversationId),
          contractApi.getContractMembers(contractId, { pageNo: 1, pageSize: 50 }),
        ]);
        if (!isMounted) return;

        const activeChatUserIds = new Set(
          convDetail.members.filter((m) => m.status === 'active' && m.userId).map((m) => m.userId!.toLowerCase()),
        );
        const missingUserIds = (membersRes.items || [])
          .filter((m) => m.status === 'active' && m.tenantId && !activeChatUserIds.has(m.tenantId.toLowerCase()))
          .map((m) => m.tenantId as string);

        const expectedTitle = `HD-${contractId.slice(0, 6).toUpperCase()}`;
        let shouldRefetch = false;

        if (convDetail.kind === 'group' && convDetail.title !== expectedTitle) {
          try {
            await chatApi.updateConversation(conversationId, { title: expectedTitle });
            shouldRefetch = true;
          } catch {
            // Non-fatal title update
          }
        }

        if (missingUserIds.length > 0) {
          await chatApi.addMembers(conversationId, { userIds: missingUserIds });
          shouldRefetch = true;
        }

        if (isMounted) {
          syncedRef.current = syncKey;
          if (shouldRefetch) {
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
  }, [conversationId, contractId, canSync, onSynced]);
};
