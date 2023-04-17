import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage as MineableCoinGuidePageZIL } from 'src/pages/GetStarted/ZilliqaGPU/CoinGuide.page';
import { MinableCoinGuidePage as MinableCoinGuidePageDual } from 'src/pages/GetStarted/Dual/CoinGuide.page';
import { findCoinsByHardwareKey } from '@/pages/GetStarted/mineableCoinList.utils';
import { useTranslation } from 'next-i18next';
import { getConfigs } from '@/pages/GetStarted/guide-configs';

export const GetStartedGPUPage = ({ ticker }: { ticker: string }) => {
  const { t } = useTranslation('get-started');
  const configs = getConfigs(t);

  return (
    <Page>
      <Content paddingLg>
        {ticker === 'zil' && <MineableCoinGuidePageZIL />}
        {ticker === 'tiron' && (
          <MinableCoinGuidePageDual
            configs={[
              {
                key: 'tiron+zil',
                label: 'Iron Fish (Testnet) + Zilliqa',
                coins: [
                  {
                    name: 'Iron Fish (Testnet)',
                    ticker: 'tiron',
                  },
                  {
                    name: 'Zilliqa',
                    ticker: 'zil',
                  },
                ],
              },
            ]}
            {...configs.iron}
          />
        )}
      </Content>
    </Page>
  );
};

export default GetStartedGPUPage;

export async function getStaticProps({ locale, params }) {
  return {
    props: {
      ticker: params.ticker,
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
    for (const coin of findCoinsByHardwareKey('dual')) {
      paths.push({ params: { ticker: coin.ticker, hw: 'dual' }, locale });
    }
  }

  return {
    paths: paths,
    fallback: false,
  };
};
