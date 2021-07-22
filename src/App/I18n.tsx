import { Helmet } from 'react-helmet';
import { useTranslation } from 'next-i18next';

export const I18n = () => {
  const { i18n } = useTranslation();
  return (
    <Helmet>
      <html lang={i18n.language} />
    </Helmet>
  );
};
