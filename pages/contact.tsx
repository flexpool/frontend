import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link, { LinkProps } from 'next/link';

export const LinkText = (props: React.PropsWithChildren<LinkProps>) => {
  return (
    <Link {...props} href={props.href || ''}>
      <a>{props.children}</a>
    </Link>
  );
};

export const ContactPage = () => {
  const { t } = useTranslation('contact-us');
  return (
    <Page>
      {/* <Helmet>
        <title>{t('head_title')}</title>
      </Helmet> */}
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
              support: <LinkText href="/support" />,
            }}
          />
        </p>
      </Content>
    </Page>
  );
};

export default ContactPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'contact-us'])),
    },
  };
}
