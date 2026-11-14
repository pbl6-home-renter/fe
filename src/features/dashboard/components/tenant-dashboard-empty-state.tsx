import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes.config';

export const TenantDashboardEmptyState = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4">
      <Card className="flex flex-col items-center gap-5 p-8 text-center sm:p-12">
        <div className="w-16 h-16 rounded-2xl bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center">
          <Home className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-rentify-text-primary tracking-tight">{t('tenant.emptyTitle')}</h1>
          <p className="text-sm text-rentify-text-secondary leading-relaxed">{t('tenant.emptyDesc')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.TENANT.CONTRACTS)}
            className="gap-2 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>{t('tenant.checkContracts')}</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.TENANT.INVOICES)}
            className="gap-2 border-rentify-divider"
          >
            <Receipt className="w-4 h-4" />
            <span>{t('tenant.viewInvoices')}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
