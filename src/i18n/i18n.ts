import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viCommon from './locales/vi/common.json';
import viAuth from './locales/vi/auth.json';
import viMedia from './locales/vi/media.json';
import viBuildings from './locales/vi/buildings.json';
import viDashboard from './locales/vi/dashboard.json';
import viRooms from './locales/vi/rooms.json';
import viContracts from './locales/vi/contracts.json';
import viChat from './locales/vi/chat.json';
import viNotifications from './locales/vi/notifications.json';
import viMeterReadings from './locales/vi/meterReadings.json';
import viUsers from './locales/vi/users.json';
import viBilling from './locales/vi/billing.json';
import viInvoices from './locales/vi/invoices.json';
import viIssues from './locales/vi/issues.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enMedia from './locales/en/media.json';
import enBuildings from './locales/en/buildings.json';
import enDashboard from './locales/en/dashboard.json';
import enRooms from './locales/en/rooms.json';
import enContracts from './locales/en/contracts.json';
import enChat from './locales/en/chat.json';
import enNotifications from './locales/en/notifications.json';
import enMeterReadings from './locales/en/meterReadings.json';
import enUsers from './locales/en/users.json';
import enBilling from './locales/en/billing.json';
import enInvoices from './locales/en/invoices.json';
import enIssues from './locales/en/issues.json';

export const defaultNS = 'common';
export const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    media: viMedia,
    buildings: viBuildings,
    dashboard: viDashboard,
    rooms: viRooms,
    contracts: viContracts,
    chat: viChat,
    notifications: viNotifications,
    meterReadings: viMeterReadings,
    users: viUsers,
    billing: viBilling,
    invoices: viInvoices,
    issues: viIssues,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    media: enMedia,
    buildings: enBuildings,
    dashboard: enDashboard,
    rooms: enRooms,
    contracts: enContracts,
    chat: enChat,
    notifications: enNotifications,
    meterReadings: enMeterReadings,
    users: enUsers,
    billing: enBilling,
    invoices: enInvoices,
    issues: enIssues,
  },
} as const;

i18n.use(initReactI18next).init({
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
