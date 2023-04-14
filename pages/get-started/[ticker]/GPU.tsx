import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage } from 'src/pages/GetStarted/GPU/CoinGuide.page';
import { DualMineBanner } from '@/pages/GetStarted/DualMineBanner';
import { findCoinsByHardwareKey } from '@/pages/GetStarted/mineableCoinList.utils';

export const GetStartedGPUPage = ({ ticker }: { ticker: string }) => {
  return (
    <Page>
      <Content paddingLg>
        <MineableCoinGuidePage />
      </Content>
      {ticker == 'zil' ||
        (ticker === 'etc' && (
          <DualMineBanner
            primary={{ name: 'Ethereum Classic', ticker: 'etc' }}
            dual={{ name: 'Zilliqa', ticker: 'zil' }}
          />
        ))}
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
