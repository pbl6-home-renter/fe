import 'i18next';
import viCommon from './locales/vi/common.json';
import viAuth from './locales/vi/auth.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof viCommon;
      auth: typeof viAuth;
    };
  }
}