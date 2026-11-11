import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

/** Shared title, description, and action layout for standard application pages. */
export const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-rentify-text-secondary">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">{actions}</div>}
  </header>
);
