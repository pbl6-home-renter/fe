import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotify } from '@/lib/notifications/use-notify';
import { ROUTES } from '@/config/routes.config';
import { chatApi } from '@/features/chat/api/chat.api';
import { fetchBuildingActiveTenantIds } from '../utils/building-chat.utils';

export const useBuildingChat = (building?: { id: string; name: string } | null) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { t } = useTranslation('buildings');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const openBuildingChat = async () => {
    if (!building?.id) return;

    setIsChatLoading(true);
    try {
      const res = await chatApi.getBuildingConversation(building.id);
      const conversation = res?.items?.[0];
      if (conversation?.id) {
        try {
          const [convDetail, residentUserIds] = await Promise.all([
            chatApi.getConversation(conversation.id),
            fetchBuildingActiveTenantIds(building.id),
          ]);

          const residentIdSet = new Set(residentUserIds.map((id) => id.toLowerCase()));

          // Remove non-residents mistakenly present in this building's chat
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
              await chatApi.removeMember(conversation.id, userId);
            } catch {
              // Non-fatal
            }
          }

          // Add active residents of this building who are not in the chat
          const activeChatUserIds = new Set(
            convDetail.members
              .filter((m) => m.status === 'active' && m.userId && !nonResidentsToRemove.includes(m.userId))
              .map((m) => m.userId!.toLowerCase()),
          );
          const missingUserIds = residentUserIds.filter((id) => !activeChatUserIds.has(id.toLowerCase()));

          if (missingUserIds.length > 0) {
            await chatApi.addMembers(conversation.id, { userIds: missingUserIds });
          }
        } catch {
          // Reconcile is non-fatal
        }

        navigate(ROUTES.CHAT_DETAIL(conversation.id));
      } else {
        notify.info(t('detail.chatLoadFailed'));
      }
    } catch {
      notify.error(t('detail.chatLoadFailed'));
    } finally {
      setIsChatLoading(false);
    }
  };

  return { openBuildingChat, isChatLoading };
};
