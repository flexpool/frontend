import { useTranslation } from 'next-i18next';
import { localStorage } from 'src/utils/localStorage';

export const HandleLegacyLangVariable = (lang: string) => {
  const { i18n } = useTranslation(['common']);
  if (lang === 'ru') {
    i18n.changeLanguage(lang);
    localStorage('lng').set(lang);
  } else {
    i18n.changeLanguage('en-US');
    localStorage('lng').set('en-US');
  }
};

export default HandleLegacyLangVariable;
