import { useTranslation } from 'react-i18next';
import { Check, Clock, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils/format';
import { MATCH_REQUEST_STATUS_MAP } from '../../constants/roommate.constants';
import type { MatchRequestDto, PublicRoommateProfileDto } from '../../types/roommate.dto';
import type { MatchRequestTab } from '../../hooks/use-match-requests-manager';

export interface MatchRequestItemProps {
  request: MatchRequestDto;
  tab: MatchRequestTab;
  candidate?: PublicRoommateProfileDto;
  isActing: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewCandidate?: (profile: PublicRoommateProfileDto) => void;
}

export const MatchRequestItem = ({
  request: req,
  tab,
  candidate,
  isActing,
  onAccept,
  onReject,
  onWithdraw,
  onViewCandidate,
}: MatchRequestItemProps) => {
  const { t } = useTranslation('roommates');
  const statusCfg = MATCH_REQUEST_STATUS_MAP[req.status] || MATCH_REQUEST_STATUS_MAP.pending;

  const displayName =
    candidate?.tenantName ||
    (tab === 'connected'
      ? t('card.candidate')
      : tab === 'incoming'
        ? `${t('requests.from')}: ${req.requesterId.slice(0, 8)}`
        : `${t('requests.to')}: ${req.targetId.slice(0, 8)}`);

  return (
    <Card className="p-4 rounded-xl bg-rentify-card border border-rentify-divider flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div
        className={`flex items-center gap-3 min-w-0 ${candidate ? 'cursor-pointer group' : ''}`}
        onClick={() => candidate && onViewCandidate?.(candidate)}
      >
        <Avatar name={candidate?.tenantName || t('card.candidate')} src={candidate?.avatarUrl || undefined} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-rentify-text-primary truncate group-hover:text-rentify-primary transition-colors">
              {displayName}
            </span>
            <Badge variant={statusCfg.variant} className="text-[10px] py-0 px-1.5">
              {t(statusCfg.labelKey)}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary mt-0.5">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{formatDate(req.respondedAt || req.createdAt)}</span>
            {candidate && (
              <span className="text-[11px] text-rentify-primary font-medium hover:underline ml-1">
                • {t('card.viewDetail')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {tab === 'incoming' && req.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isActing}
              onClick={() => onReject(req.id)}
              className="h-8 px-2.5 text-xs text-rentify-danger hover:text-rentify-danger hover:bg-rentify-danger/10 gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t('requests.rejectAction')}</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isActing}
              onClick={() => onAccept(req.id)}
              className="h-8 px-3 text-xs gap-1 font-semibold"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{t('requests.acceptAction')}</span>
            </Button>
          </>
        )}

        {tab === 'outgoing' && req.status === 'pending' && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isActing}
            onClick={() => onWithdraw(req.id)}
            className="h-8 px-2.5 text-xs text-rentify-text-secondary hover:text-rentify-danger gap-1"
          >
            <X className="h-3.5 w-3.5" />
            <span>{t('requests.withdrawAction')}</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
