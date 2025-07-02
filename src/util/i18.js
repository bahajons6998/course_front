import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../local/en.json';
import uz from '../local/uz.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uz: { translation: uz },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;