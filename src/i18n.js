import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    backend: {
      loadPath: `${backendUrl}/api/translations/{{lng}}`,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
