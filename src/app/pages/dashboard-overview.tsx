import { useAuth } from '@/hooks/use-auth';

export interface DashboardOverviewProps {
  title?: string;
  desc?: string;
  roleConfig?: {
    landlord?: { title: string; desc: string };
    tenant?: { title: string; desc: string };
    admin?: { title: string; desc: string };
  };
}

export const DashboardOverview = ({ title, desc, roleConfig }: DashboardOverviewProps) => {
  const { role } = useAuth();

  const currentConfig = (role && roleConfig?.[role]) || {
    title: title || 'Tổng quan hệ thống',
    desc: desc || 'Chào mừng bạn đến với Rentify',
  };

  return (
    <div className="space-y-4">
      <div className="bg-rentify-surface rounded-2xl p-6 sm:p-8 border border-rentify-divider shadow-xs">
        <h1 className="text-2xl font-bold text-rentify-text-primary tracking-tight">
          {currentConfig.title}
        </h1>
        <p className="text-sm text-rentify-text-secondary mt-1">
          {currentConfig.desc}
        </p>
      </div>
    </div>
  );
};

