
import i18n from './index';

// Initialiser la langue à partir de localStorage ou utiliser le français par défaut
const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
};

export default initializeLanguage;
