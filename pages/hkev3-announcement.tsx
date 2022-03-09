import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Page } from '../src/components/layout/Page';
import { Content } from '../src/components/layout/Content';

export const Announcement = () => {
  return (
    <Page>
      <Content md paddingLg>
        <h1>HKE V3 Announcement</h1>
        <p style={{ marginTop: '30px' }}>
          如果您无法连接到 hke.fpmirror.com， 请尝试我们提供的最新HKE地址。
          <br />
          新的地址为：fmc.fp-gfw.net
        </p>
        <h1>HKE V3 Announcement</h1>
        <p style={{ marginTop: '30px' }}>
          If you are having trouble connect to hke.fpmirror.com, please try our
          latest HKE address.
          <br />
          The new address is: fmc.fp-gfw.net
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
