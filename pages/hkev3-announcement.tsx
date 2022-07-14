import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';
import { Sticker } from '@/components/Sticker';
import styled from 'styled-components';

const DomainHighlight = styled(Sticker)`
  text-transform: none;
`;

export const Announcement = () => {
  return (
    <Page>
      <Content md paddingLg>
        <h1>HKE v3 Announcement</h1>
        <p style={{ marginTop: '30px' }}>
          如果您无法连接到{' '}
          <DomainHighlight>
            hke&#60;dot&#62;fpmirror&#60;dot&#62;com
          </DomainHighlight>
          ， 请尝试我们提供的最新HKE地址。
          <br />
          新的地址为：
          <DomainHighlight>
            fmc&#60;dot&#62;fp-gfw&#60;dot&#62;com
          </DomainHighlight>
        </p>
        <h1>HKE v3 Announcement</h1>
        <p style={{ marginTop: '30px' }}>
          If you are having trouble connect to
          <DomainHighlight>
            hke&#60;dot&#62;fpmirror&#60;dot&#62;com
          </DomainHighlight>
          , please try our latest HKE address.
          <br />
          The new address is:{' '}
          <DomainHighlight>
            fmc&#60;dot&#62;fp-gfw&#60;dot&#62;com
          </DomainHighlight>
        </p>
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
      ])),
    },
  };
}
