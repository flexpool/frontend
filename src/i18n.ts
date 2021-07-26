import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { isDev } from './utils/devUtils';
import { localStorage } from './utils/localStorage';

const defaultLng = localStorage<string>('lng').get();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    defaultNS: 'common',
    lng: defaultLng || 'en-US',
    fallbackLng: 'en-US',
    keySeparator: '.',
    // debug: isDev(),
    ns: ['common', 'home'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
