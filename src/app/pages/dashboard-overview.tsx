interface DashboardOverviewProps {
  title: string;
  desc: string;
}

export const DashboardOverview = ({ title, desc }: DashboardOverviewProps) => (
  <div className="space-y-4">
    <div className="bg-[var(--color-rentify-surface,#FFFFFF)] rounded-2xl p-6 sm:p-8 border border-[var(--color-rentify-divider,#D7E3F2)] shadow-xs">
      <h1 className="text-2xl font-bold text-[var(--color-rentify-text-primary,#142A4C)] tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-[var(--color-rentify-text-secondary,#5C7290)] mt-1">
        {desc}
      </p>
    </div>
  </div>
);

export default DashboardOverview;

