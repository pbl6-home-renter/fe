import 'i18next';
import viCommon from '@/i18n/locales/vi/common.json';
import viAuth from '@/i18n/locales/vi/auth.json';
import viMedia from '@/i18n/locales/vi/media.json';
import viBuildings from '@/i18n/locales/vi/buildings.json';
import viDashboard from '@/i18n/locales/vi/dashboard.json';
import viRooms from '@/i18n/locales/vi/rooms.json';
import viContracts from '@/i18n/locales/vi/contracts.json';
import viChat from '@/i18n/locales/vi/chat.json';
import viNotifications from '@/i18n/locales/vi/notifications.json';
import viMeterReadings from '@/i18n/locales/vi/meterReadings.json';
import viUsers from '@/i18n/locales/vi/users.json';
import viBilling from '@/i18n/locales/vi/billing.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof viCommon;
      auth: typeof viAuth;
      media: typeof viMedia;
      buildings: typeof viBuildings;
      dashboard: typeof viDashboard;
      rooms: typeof viRooms;
      contracts: typeof viContracts;
      chat: typeof viChat;
      notifications: typeof viNotifications;
      meterReadings: typeof viMeterReadings;
      users: typeof viUsers;
      billing: typeof viBilling;
    };
  }
}
