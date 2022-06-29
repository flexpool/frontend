import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { ChiaCliGuidePage } from 'src/pages/GetStarted/ChiaCli/Guide.page';
import FlexFarmerAnnouncement from '@/pages/MinerDashboard/Announcements/FlexFarmerAnnouncement';

export const GetStartedXchCliPage = () => {
  return (
    <Page>
      <Content paddingLg>
        <ChiaCliGuidePage />
      </Content>
      <FlexFarmerAnnouncement removable={false} />
    </Page>
  );
};

export default GetStartedXchCliPage;

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
    paths.push({ params: { ticker: 'xch', hw: 'XCH-CLI' }, locale });
  }

  return {
    paths: paths,
    fallback: false,
  };
};
