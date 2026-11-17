import { useTranslation } from 'react-i18next';
import { ArrowDownLeft, ArrowUpRight, UserCheck, Users } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { useMatchRequestsManager } from '../../hooks/use-match-requests-manager';
import { MatchRequestItem } from './match-request-item';
import type { PublicRoommateProfileDto } from '../../types/roommate.dto';

export interface MatchRequestsDialogProps {
  open: boolean;
  onClose: () => void;
  candidateMap?: Map<string, PublicRoommateProfileDto>;
  onViewCandidate?: (profile: PublicRoommateProfileDto) => void;
}

export const MatchRequestsDialog = ({ open, onClose, candidateMap, onViewCandidate }: MatchRequestsDialogProps) => {
  const { t } = useTranslation('roommates');
  const {
    tab,
    setTab,
    requests,
    pendingIncomingCount,
    connectedCount,
    isLoading,
    handleAccept,
    handleReject,
    handleWithdraw,
    isActing,
  } = useMatchRequestsManager(open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-rentify-primary" />
          <span className="text-base font-bold text-rentify-text-primary">{t('requests.dialogTitle')}</span>
        </div>
      }
      description={t('requests.dialogDesc')}
      maxWidth="lg"
      footer={
        <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
          {t('modal.closeAction')}
        </Button>
      }
    >
      <div className="space-y-4 py-2">
        {/* Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-rentify-divider pb-3 overflow-x-auto">
          <Button
            variant={tab === 'incoming' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTab('incoming')}
            className="text-xs gap-1.5 shrink-0"
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>{t('requests.tabIncoming')}</span>
            {pendingIncomingCount > 0 && (
              <Badge variant="error" className="ml-1 text-[10px] py-0 px-1.5 rounded-full">
                {pendingIncomingCount}
              </Badge>
            )}
          </Button>

          <Button
            variant={tab === 'outgoing' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTab('outgoing')}
            className="text-xs gap-1.5 shrink-0"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{t('requests.tabOutgoing')}</span>
          </Button>

          <Button
            variant={tab === 'connected' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTab('connected')}
            className="text-xs gap-1.5 shrink-0"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{t('requests.tabConnected')}</span>
            {connectedCount > 0 && (
              <Badge variant="success" className="ml-1 text-[10px] py-0 px-1.5 rounded-full">
                {connectedCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title={t(
              tab === 'connected'
                ? 'requests.emptyConnected'
                : tab === 'incoming'
                  ? 'requests.emptyIncoming'
                  : 'requests.emptyOutgoing',
            )}
            description={t(tab === 'connected' ? 'requests.emptyConnectedDesc' : 'requests.emptyDesc')}
          />
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {requests.map((req) => (
              <MatchRequestItem
                key={req.id}
                request={req}
                tab={tab}
                candidate={candidateMap?.get(tab === 'incoming' ? req.requesterId : req.targetId)}
                isActing={isActing}
                onAccept={handleAccept}
                onReject={handleReject}
                onWithdraw={handleWithdraw}
                onViewCandidate={onViewCandidate}
              />
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
};
