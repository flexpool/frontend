import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage } from 'src/pages/GetStarted/GPU/CoinGuide.page';
import { findCoinsByHardwareKey } from '@/pages/GetStarted/mineableCoinList.utils';
import { getConfigs } from '@/pages/GetStarted/guide-configs';
import { useTranslation } from 'next-i18next';

export const GetStartedGPUPage = ({ ticker }: { ticker: string }) => {
  const { t } = useTranslation('get-started');
  const configs = getConfigs(t);

  return (
    <Page>
      <Content paddingLg>
        {(() => {
          switch (ticker) {
            case 'iron':
              return <MineableCoinGuidePage {...configs.iron} />;
            default:
              return <MineableCoinGuidePage />;
          }
        })()}
      </Content>
    </Page>
  );
};

export default GetStartedGPUPage;

export const getStaticProps: GetStaticProps<any, { ticker: string }> = async ({
  locale,
  params,
}) => {
  return {
    props: {
      ticker: params?.ticker,
      ...(await serverSideTranslations(locale!, [
        'common',
        'get-started',
        'cookie-consent',
        'seo',
      ])),
    },
  };
};

export const getStaticPaths = ({ locales }) => {
  const paths: Array<{ params: { ticker: string; hw: string }; locale: any }> =
    [];

  for (const locale of locales) {
    for (const coin of findCoinsByHardwareKey('GPU')) {
      paths.push({ params: { ticker: coin.ticker, hw: 'GPU' }, locale });
    }
  }

  return {
    paths: paths,
    fallback: false,
  };
};
