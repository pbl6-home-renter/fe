import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { i18n } from '@/i18n/i18n';
import { useCurrentUserQuery } from '@/features/auth/hooks/auth/use-current-user-query';

interface AppProviderProps {
  children: ReactNode;
}

const AuthSessionInitializer = ({ children }: { children: ReactNode }) => {
  useCurrentUserQuery();
  return <>{children}</>;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthSessionInitializer>
          {children}
        </AuthSessionInitializer>
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </I18nextProvider>
  );
};
