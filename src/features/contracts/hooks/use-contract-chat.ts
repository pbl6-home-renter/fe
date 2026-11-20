import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { ROUTES } from '@/config/routes.config';
import { chatApi } from '@/features/chat/api/chat.api';
import { contractApi } from '../api/contract.api';
import { ContractStatus } from '../enums/contract-status.enum';
import type { ContractDetailDto } from '../types/contract.dto';

export const useContractChat = (contract?: ContractDetailDto | null) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { t } = useTranslation('contracts');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const openContractChat = async () => {
    if (!contract) return;
    if (contract.status !== ContractStatus.ACTIVE) {
      notify.info(t('detail.chatAvailableOnActive'));
      return;
    }

    setIsChatLoading(true);
    try {
      const res = await chatApi.getContractConversation(contract.id);
      const conversation = res?.items?.[0];
      if (conversation?.id) {
        try {
          const expectedTitle = `HD-${contract.id.slice(0, 6).toUpperCase()}`;
          const [convDetail, membersRes] = await Promise.all([
            chatApi.getConversation(conversation.id),
            contractApi.getContractMembers(contract.id, { pageNo: 1, pageSize: 50 }),
          ]);
          if (convDetail.kind === 'group' && convDetail.title !== expectedTitle) {
            try {
              await chatApi.updateConversation(conversation.id, { title: expectedTitle });
            } catch {
              // Non-fatal title update
            }
          }
          const activeChatUserIds = new Set(
            convDetail.members.filter((m) => m.status === 'active' && m.userId).map((m) => m.userId!.toLowerCase()),
          );
          const missingUserIds = (membersRes.items || [])
            .filter((m) => m.status === 'active' && m.tenantId && !activeChatUserIds.has(m.tenantId.toLowerCase()))
            .map((m) => m.tenantId as string);

          if (missingUserIds.length > 0) {
            await chatApi.addMembers(conversation.id, { userIds: missingUserIds });
          }
        } catch {
          // Reconcile is non-fatal; proceed to navigate to chat
        }

        navigate(ROUTES.CHAT_DETAIL(conversation.id));
      } else {
        navigate(ROUTES.CHAT);
      }
    } catch {
      notify.error(t('detail.chatLoadFailed'));
    } finally {
      setIsChatLoading(false);
    }
  };

  return { openContractChat, isChatLoading };
};
