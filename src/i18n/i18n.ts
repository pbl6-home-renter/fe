import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viCommon from './locales/vi/common.json';
import viAuth from './locales/vi/auth.json';
import viMedia from './locales/vi/media.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enMedia from './locales/en/media.json';

export const defaultNS = 'common';
export const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    media: viMedia,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    media: enMedia,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'vi',
    defaultNS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

/**
 * Helper function to toggle or switch language between 'vi' and 'en'
 */
export const changeLanguage = (lang: 'vi' | 'en') => {
  return i18n.changeLanguage(lang);
};

export { i18n };
