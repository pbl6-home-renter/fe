import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { FileText, UserCheck, Phone } from 'lucide-react';
import type { RoomCurrentContractDto, RoomMemberDto } from '../../types/room.dto';

interface RoomTenantContractCardProps {
  contract?: RoomCurrentContractDto | null;
  members?: RoomMemberDto[];
}

export const RoomTenantContractCard = ({
  contract,
  members = [],
}: RoomTenantContractCardProps) => {
  const { t } = useTranslation('rooms');

  return (
    <Card className="p-6 border-rentify-divider bg-rentify-surface rounded-2xl shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-rentify-primary" />
          <h3 className="font-bold text-base text-rentify-text-primary">
            {t('detail.contractTitle')}
          </h3>
        </div>
        {contract ? (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rentify-success/10 text-rentify-success border border-rentify-success/30">
            {contract.status}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-low text-rentify-text-secondary">
            {t('detail.noContract')}
          </span>
        )}
      </div>

      {contract ? (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-low/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rentify-text-secondary">{t('detail.contractCode')}</span>
              <span className="font-bold text-rentify-text-primary font-mono">{contract.contractCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rentify-text-secondary">{t('detail.contractPeriod')}</span>
              <span className="font-medium text-rentify-text-primary">
                {new Date(contract.startDate).toLocaleDateString('vi-VN')} – {new Date(contract.endDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {members.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-xs text-rentify-text-primary">
                {t('detail.membersTitle')} ({members.length})
              </h4>
              <div className="space-y-1.5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl bg-surface-container-low/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rentify-primary-container text-rentify-on-primary-container flex items-center justify-center font-bold text-[11px]">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-rentify-text-primary">{member.name}</span>
                          {member.isRepresentative && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-rentify-primary font-medium" title={t('detail.representative')}>
                              <UserCheck className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="text-rentify-text-secondary hover:text-rentify-primary flex items-center gap-1 text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 text-center space-y-1">
          <p className="text-xs font-medium text-rentify-text-primary">
            {t('detail.vacantRoomTitle')}
          </p>
          <p className="text-[11px] text-rentify-text-secondary">
            {t('detail.vacantRoomDesc')}
          </p>
        </div>
      )}
    </Card>
  );
};
