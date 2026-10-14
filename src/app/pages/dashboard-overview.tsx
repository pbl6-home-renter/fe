interface DashboardOverviewProps {
  title: string;
  desc: string;
}

export const DashboardOverview = ({ title, desc }: DashboardOverviewProps) => (
  <div className="space-y-4">
    <div className="bg-rentify-surface rounded-2xl p-6 sm:p-8 border border-rentify-divider shadow-xs">
      <h1 className="text-2xl font-bold text-rentify-text-primary tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-rentify-text-secondary mt-1">
        {desc}
      </p>
    </div>
  </div>
);

