import FlexFarmerAnnouncement from '@/pages/MinerDashboard/Announcements/FlexFarmerAnnouncement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { ChiaGuiGuidePage } from 'src/pages/GetStarted/ChiaGui/Guide.page';

export const GetStartedXchGuiPage = () => {
  return (
    <Page>
      <Content paddingLg>
        <ChiaGuiGuidePage />
      </Content>
      <FlexFarmerAnnouncement removable={false} borderLocation="top" />
    </Page>
  );
};

export default GetStartedXchGuiPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

export const getStaticPaths = ({ locales }) => {
  const paths: Array<{ params: { ticker: string; hw: string }; locale: any }> =
    [];

  for (const locale of locales) {
    paths.push({ params: { ticker: 'xch', hw: 'XCH-GUI' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
