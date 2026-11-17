import { useTranslation } from 'react-i18next';
import { Briefcase, Calendar, Check, Clock, MapPin, Send, X } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatVnd, formatDate } from '@/lib/utils/format';
import { getGenderLabelKey, LIFESTYLE_ITEMS } from '../../constants/roommate.constants';
import type { PublicRoommateProfileDto, CandidateMatchStatus } from '../../types/roommate.dto';

export interface RoommateDetailModalProps {
  profile: PublicRoommateProfileDto | null;
  onClose: () => void;
  onSendMatch: (targetId: string) => void;
  isSendingMatch?: boolean;
  matchStatus?: CandidateMatchStatus;
  pendingMatchRequestId?: string;
  onWithdrawMatch?: (requestId: string) => void;
  isWithdrawingMatch?: boolean;
  onOpenMatchRequests?: () => void;
}

export const RoommateDetailModal = ({
  profile,
  onClose,
  onSendMatch,
  isSendingMatch = false,
  matchStatus = 'none',
  pendingMatchRequestId,
  onWithdrawMatch,
  isWithdrawingMatch = false,
  onOpenMatchRequests,
}: RoommateDetailModalProps) => {
  const { t } = useTranslation('roommates');
  if (!profile) return null;

  const age = profile.birthYear ? new Date().getFullYear() - profile.birthYear : null;
  const locationDisplay =
    profile.preferredArea ||
    [profile.preferredDistrict, profile.preferredProvince].filter(Boolean).join(', ') ||
    t('card.anyLocation');

  return (
    <Dialog
      open={Boolean(profile)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Avatar name={profile.tenantName || 'Tenant'} src={profile.avatarUrl} size="md" />
          <div>
            <div className="text-base font-bold text-rentify-text-primary">
              {profile.tenantName || t('card.anonymousTenant')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary">
              {getGenderLabelKey(profile.gender) && <span>{t(getGenderLabelKey(profile.gender)!)}</span>}
              {age && <span>• {t('card.age', { age })}</span>}
            </div>
          </div>
        </div>
      }
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            {t('modal.closeAction')}
          </Button>
          {matchStatus === 'connected' ? (
            <Badge
              variant="success"
              className="h-8 px-3 text-xs gap-1 font-semibold flex items-center justify-center py-0"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{t('card.connected')}</span>
            </Badge>
          ) : matchStatus === 'pending_outgoing' ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 font-bold text-rentify-danger border-rentify-danger/30 hover:bg-rentify-danger/10"
              disabled={isWithdrawingMatch}
              onClick={() => {
                if (pendingMatchRequestId) onWithdrawMatch?.(pendingMatchRequestId);
              }}
            >
              <X className="h-3.5 w-3.5" />
              <span>{t('card.withdrawRequest')}</span>
            </Button>
          ) : matchStatus === 'pending_incoming' ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 font-bold text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/10"
              onClick={() => {
                onClose();
                onOpenMatchRequests?.();
              }}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{t('card.viewRequest')}</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="text-xs gap-1.5 font-bold"
              disabled={isSendingMatch}
              onClick={() => onSendMatch(profile.tenantId)}
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t('card.sendRequest')}</span>
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-1">
            <span className="text-rentify-text-secondary block font-medium">{t('modal.preferredArea')}</span>
            <div className="flex items-center gap-1.5 font-bold text-rentify-text-primary">
              <MapPin className="h-4 w-4 text-rentify-primary shrink-0" />
              <span>{locationDisplay}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-1">
            <span className="text-rentify-text-secondary block font-medium">{t('modal.budgetRange')}</span>
            <div className="font-bold text-rentify-primary text-sm tabular-nums">
              {profile.budgetMin && profile.budgetMax
                ? `${formatVnd(profile.budgetMin)} - ${formatVnd(profile.budgetMax)}`
                : profile.budgetMax
                  ? `${t('card.upTo')} ${formatVnd(profile.budgetMax)}`
                  : t('card.flexibleBudget')}
            </div>
          </div>

          {profile.occupation && (
            <div className="p-3.5 rounded-xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-1">
              <span className="text-rentify-text-secondary block font-medium">{t('modal.occupation')}</span>
              <div className="flex items-center gap-1.5 font-semibold text-rentify-text-primary">
                <Briefcase className="h-4 w-4 text-rentify-primary shrink-0" />
                <span>{profile.occupation}</span>
              </div>
            </div>
          )}

          {profile.moveInOn && (
            <div className="p-3.5 rounded-xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-1">
              <span className="text-rentify-text-secondary block font-medium">{t('modal.moveInDate')}</span>
              <div className="flex items-center gap-1.5 font-semibold text-rentify-text-primary">
                <Calendar className="h-4 w-4 text-rentify-primary shrink-0" />
                <span>{formatDate(profile.moveInOn)}</span>
              </div>
            </div>
          )}
        </div>

        {profile.bio && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-rentify-text-primary uppercase tracking-wider">
              {t('modal.aboutMe')}
            </h4>
            <div className="p-3.5 rounded-xl bg-rentify-surface-container-low/50 border border-rentify-divider text-xs sm:text-sm text-rentify-text-secondary leading-relaxed whitespace-pre-line">
              {profile.bio}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rentify-text-primary uppercase tracking-wider">
            {t('modal.lifestyleTitle')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LIFESTYLE_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = Boolean(profile.lifestyle && profile.lifestyle[item.key]);
              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                    active
                      ? 'border-rentify-primary/40 bg-rentify-primary-container/10 text-rentify-primary font-semibold'
                      : 'border-rentify-divider text-rentify-outline opacity-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{t(item.labelKey)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
