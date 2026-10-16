import 'i18next';
import viCommon from '@/i18n/locales/vi/common.json';
import viAuth from '@/i18n/locales/vi/auth.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof viCommon;
      auth: typeof viAuth;
    };
  }
}

