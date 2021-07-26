import { useTranslation } from 'next-i18next';

export const I18n = () => {
  const { i18n } = useTranslation();
  return (
    <></>
    // <Head>
    //   <html lang={i18n.language} />
    // </Head>
  );
};
