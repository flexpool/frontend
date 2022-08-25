import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { LinkOut } from '@/components/LinkOut';
import { NextSeo } from 'next-seo';
import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { Spacer } from '@/components/layout/Spacer';
import { Trans, useTranslation } from 'next-i18next';
import styled from 'styled-components';

const Break = () => {
  return (
    <>
      <br />
      <br />
    </>
  );
};

const End = styled.span`
  display: block;
  text-align: right;
`;

export const Announcement = () => {
  const { t } = useTranslation('merge-announcement');
  const { t: seoT } = useTranslation('seo');

  return (
    <Page>
      <NextSeo
        title={seoT('title.the_merge_announcement')}
        description={seoT('website_description.the_merge_announcement')}
      />
      <Content md paddingLg>
        <h1>{t('title')}</h1>
        <p style={{ marginTop: '30px' }}>
          <Trans
            t={t}
            i18nKey="content"
            components={{
              support: <LinkOut href="https://www.flexpool.io/support" />,
              break: <Break />,
              end: <End />,
              b: <b />,
            }}
          />
        </p>
        <Spacer />

        <div>
          <a
            href="https://blog.ethereum.org/2022/08/24/mainnet-merge-announcement/"
            target="_blank"
            rel="noreferrer"
          >
            {t('view_official')}
          </a>
        </div>

        <Spacer size="sm" />

        <Link href="/the-merge-countdown" passHref>
          <a>{t('view_countdown')}</a>
        </Link>
      </Content>
    </Page>
  );
};

export default Announcement;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'contact-us',
        'cookie-consent',
        'seo',
        'merge-announcement',
      ])),
    },
  };
}
