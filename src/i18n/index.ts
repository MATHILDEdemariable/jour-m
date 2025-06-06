
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { frTranslation } from './fr';
import { enTranslation } from './en';

// Configuration i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: 'fr', // Langue par défaut (français)
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // React échappe déjà les valeurs
    }
  });

// Initialiser la langue à partir de localStorage
const savedLanguage = localStorage.getItem('preferredLanguage');
if (savedLanguage) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;
