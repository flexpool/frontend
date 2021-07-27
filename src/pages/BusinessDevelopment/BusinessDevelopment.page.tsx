import { Page } from 'src/components/layout/Page';
import { Content } from 'src/components/layout/Content';

import { Trans, useTranslation } from 'next-i18next';
import { LinkOut } from 'src/components/LinkOut';

export const BusinessDevelopmentPage = () => {
  const { t } = useTranslation('business-dev');
  return (
    <Page>
      {/* <Head>
        <title>{t('head_title')}</title>
      </Head> */}
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
