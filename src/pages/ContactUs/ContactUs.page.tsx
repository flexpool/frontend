import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

export const ContactUsPage = () => {
  const { t } = useTranslation('contact-us');
  return (
    <Page>
      {/* <Head>
        <title>{t('head_title')}</title>
      </Head> */}
      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <p style={{ marginTop: '30px' }}>
          <Trans
            ns="contact-us"
            i18nKey="description"
            values={{ email: 'hq@flexpool.io' }}
            components={{
              // eslint-disable-next-line
              email: <a href="mailto:hq@flexpool.io" />,
              support: <Link to="/support" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default ContactUsPage;
