import { useTranslation } from 'react-i18next';
import { Briefcase, Check, ChevronRight, Clock, MapPin, Send, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { formatVnd } from '@/lib/utils/format';
import { getGenderLabelKey, LIFESTYLE_ITEMS } from '../../constants/roommate.constants';
import type { PublicRoommateProfileDto, CandidateMatchStatus } from '../../types/roommate.dto';

export type { CandidateMatchStatus };

export interface RoommateCardProps {
  profile: PublicRoommateProfileDto;
  onOpenDetail: () => void;
  onSendMatch: () => void;
  isSendingMatch?: boolean;
  matchStatus?: CandidateMatchStatus;
  pendingMatchRequestId?: string;
  onWithdrawMatch?: (requestId: string) => void;
  isWithdrawingMatch?: boolean;
  onOpenMatchRequests?: () => void;
}

export const RoommateCard = ({
  profile,
  onOpenDetail,
  onSendMatch,
  isSendingMatch = false,
  matchStatus = 'none',
  pendingMatchRequestId,
  onWithdrawMatch,
  isWithdrawingMatch = false,
  onOpenMatchRequests,
}: RoommateCardProps) => {
  const { t } = useTranslation('roommates');
  const activeLifestyle = LIFESTYLE_ITEMS.filter((item) => profile.lifestyle && profile.lifestyle[item.key]).slice(
    0,
    3,
  );
  const locationDisplay =
    profile.preferredArea ||
    [profile.preferredDistrict, profile.preferredProvince].filter(Boolean).join(', ') ||
    t('card.anyLocation');
  const age = profile.birthYear ? new Date().getFullYear() - profile.birthYear : null;

  const budgetDisplay =
    profile.budgetMin && profile.budgetMax
      ? `${formatVnd(profile.budgetMin)} - ${formatVnd(profile.budgetMax)}`
      : profile.budgetMin
        ? `${t('card.from')} ${formatVnd(profile.budgetMin)}`
        : profile.budgetMax
          ? `${t('card.upTo')} ${formatVnd(profile.budgetMax)}`
          : t('card.flexibleBudget');

  return (
    <Card
      variant="interactive"
      onClick={onOpenDetail}
      className="flex h-full flex-col justify-between overflow-hidden p-5 rounded-2xl bg-rentify-card border border-rentify-divider shadow-xs hover:border-rentify-primary/50 hover:shadow-md transition-all cursor-pointer group space-y-4"
    >
      <div className="space-y-4">
        {/* Candidate Profile Header */}
        <div className="flex items-start gap-3.5">
          <Avatar
            name={profile.tenantName || 'Tenant'}
            src={profile.avatarUrl}
            size="lg"
            className="ring-2 ring-rentify-primary/20"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-rentify-text-primary truncate">
              {profile.tenantName || t('card.anonymousTenant')}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {getGenderLabelKey(profile.gender) && (
                <Badge variant="secondary" className="text-[11px] py-0.5 px-2">
                  {t(getGenderLabelKey(profile.gender)!)}
                </Badge>
              )}
              {age && (
                <Badge variant="secondary" className="text-[11px] py-0.5 px-2">
                  {t('card.age', { age })}
                </Badge>
              )}
              {profile.occupation && (
                <Badge variant="secondary" className="text-[11px] py-0.5 px-2 truncate max-w-[120px]">
                  <Briefcase className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">{profile.occupation}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Location & Budget Row */}
        <div className="p-3 rounded-xl bg-rentify-surface-container-low/70 border border-rentify-divider space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-rentify-text-primary font-medium truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rentify-primary" />
            <span className="truncate">{locationDisplay}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1 border-t border-rentify-divider/50">
            <span className="text-rentify-text-secondary text-[11px]">{t('card.budgetLabel')}</span>
            <span className="font-bold text-rentify-primary text-sm tabular-nums">{budgetDisplay}</span>
          </div>
        </div>

        {profile.bio && (
          <p className="text-xs text-rentify-text-secondary line-clamp-2 leading-relaxed italic">"{profile.bio}"</p>
        )}

        {/* Lifestyle Chips */}
        {activeLifestyle.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeLifestyle.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rentify-primary-container/15 text-rentify-primary border border-rentify-primary/20"
                >
                  <Icon className="h-3 w-3" />
                  <span>{t(item.labelKey)}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-rentify-divider">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail();
          }}
        >
          <span>{t('card.viewDetail')}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {matchStatus === 'connected' ? (
          <Badge variant="success" className="flex-1 h-8 text-xs gap-1 font-semibold justify-center py-0">
            <Check className="h-3.5 w-3.5" />
            <span>{t('card.connected')}</span>
          </Badge>
        ) : matchStatus === 'pending_outgoing' ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1 font-semibold text-rentify-danger border-rentify-danger/30 hover:bg-rentify-danger/10"
            disabled={isWithdrawingMatch}
            onClick={(e) => {
              e.stopPropagation();
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
            className="flex-1 text-xs gap-1 font-semibold text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/10"
            onClick={(e) => {
              e.stopPropagation();
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
            className="flex-1 text-xs gap-1.5 font-semibold"
            disabled={isSendingMatch}
            onClick={(e) => {
              e.stopPropagation();
              onSendMatch();
            }}
          >
            <Send className="h-3.5 w-3.5" />
            <span>{t('card.sendRequest')}</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
