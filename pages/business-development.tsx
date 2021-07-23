import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { LinkOut } from '../src/components/LinkOut';

export const BusinessDevelopmentPage = () => {
  const { t } = useTranslation('business-dev');
  return (
    <Page>
      {/* <Helmet>
        <title>{t('head_title')}</title>
      </Helmet> */}
      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <h2>{t('touch.title')}</h2>
        <p>
          <Trans
            i18nKey="touch.description"
            ns="business-dev"
            values={{
              email: 'hq@flexpool.io',
            }}
            components={{
              email: <LinkOut href="mailto:hq@flexpool.io" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default BusinessDevelopmentPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'business-dev'])),
    },
  };
}
