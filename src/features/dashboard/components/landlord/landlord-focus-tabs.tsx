import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronRight, Receipt } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/feedback/skeleton';
import { formatDate, formatVnd } from '@/lib/utils/format';
import { InvoiceStatusBadge } from '@/features/invoices/components/invoice-status-badge';
import type { InvoiceListItemDto } from '@/features/invoices/types/invoices.dto';
import type { IssueListItem } from '@/features/issues/types/issue.dto';

export interface LandlordFocusTabsProps {
  issues: IssueListItem[];
  invoices: InvoiceListItemDto[];
  isIssuesLoading?: boolean;
  isInvoicesLoading?: boolean;
}

export const LandlordFocusTabs = ({ issues, invoices, isIssuesLoading, isInvoicesLoading }: LandlordFocusTabsProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'issues' | 'invoices'>('issues');

  return (
    <Card className="h-full p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
      <div>
        {/* Header: Tab Switcher & Navigation CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rentify-divider">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-rentify-background border border-rentify-divider w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'issues'
                  ? 'bg-rentify-surface text-rentify-primary shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('full.tabsIssues', { count: issues.length })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'invoices'
                  ? 'bg-rentify-surface text-rentify-primary shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{t('full.tabsInvoices', { count: invoices.length })}</span>
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(activeTab === 'issues' ? ROUTES.LANDLORD.ISSUES : ROUTES.LANDLORD.INVOICES)}
            className="gap-1 text-rentify-primary hover:text-rentify-primary text-xs font-semibold self-end sm:self-auto"
          >
            <span>{activeTab === 'issues' ? t('full.viewAllIssues') : t('full.viewAllInvoices')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'issues' ? (
            isIssuesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ) : issues.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-rentify-success mx-auto" />
                <p className="text-sm font-bold text-rentify-text-primary">{t('full.noRecentIssues')}</p>
                <p className="text-xs text-rentify-text-secondary">{t('full.noRecentIssuesDesc')}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {issues.slice(0, 4).map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => navigate(ROUTES.LANDLORD.ISSUE_DETAIL(issue.id))}
                    className="p-3 rounded-xl bg-rentify-background/70 hover:bg-rentify-background border border-rentify-divider cursor-pointer group flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                          {issue.title}
                        </span>
                        <Badge variant="warning" className="text-[10px] shrink-0">
                          {issue.urgency}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-rentify-text-secondary mt-0.5 truncate">
                        {issue.buildingName} · {issue.roomName}
                        {issue.createdAt ? ` · ${formatDate(issue.createdAt)}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            )
          ) : isInvoicesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Receipt className="w-10 h-10 text-rentify-text-muted mx-auto" />
              <p className="text-sm font-bold text-rentify-text-primary">{t('full.noRecentInvoices')}</p>
              <p className="text-xs text-rentify-text-secondary">{t('full.noRecentInvoicesDesc')}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {invoices.slice(0, 4).map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate(ROUTES.LANDLORD.INVOICE_DETAIL(invoice.id))}
                  className="p-3 rounded-xl bg-rentify-background/70 hover:bg-rentify-background border border-rentify-divider cursor-pointer group flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors">
                        {invoice.code}
                      </span>
                      <InvoiceStatusBadge status={invoice.invoiceStatus} />
                    </div>
                    <p className="text-[11px] text-rentify-text-secondary mt-0.5 truncate">
                      {invoice.roomName}
                      {invoice.tenantName ? ` · ${invoice.tenantName}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-rentify-text-primary tabular-nums shrink-0">
                    {formatVnd(invoice.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
