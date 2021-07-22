import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Helmet } from 'react-helmet-async';
// import { Redirect, Route, Switch } from 'react-router-dom';
import { Content } from '../../src/components/layout/Content';
import { Page } from '../../src/components/layout/Page';
import { MineableCoinGuidePage } from '../../src/pages/GetStarted/GPU/CoinGuide.page';
import { MineableCoinList } from '../../src/pages/GetStarted/CoinList.page';
import { MiningCoinSelectTypePage } from '../../src/pages/GetStarted/CoinSelectMiningType.page';
import { NicehashGuidePage } from '../../src/pages/GetStarted/Nicehash/NicehashGuide.page';
import { ChiaCliGuidePage } from '../../src/pages/GetStarted/ChiaCli/Guide.page';
import { ChiaGuiGuidePage } from '../../src/pages/GetStarted/ChiaGui/Guide.page';

export const GetStartedPage = () => {
  return (
    <Page>
      {/* <Helmet>
        <title>Start mining with Flexpool</title>
      </Helmet> */}
      <Content paddingLg>
        <MineableCoinList />
        {/* <Switch>
          <Route
            exact
            strict
            component={MineableCoinList}
            path="/get-started"
          />

          <Route
            component={NicehashGuidePage}
            path="/get-started/:ticker/nicehash"
          />
          <Route
            component={ChiaCliGuidePage}
            path="/get-started/:ticker/XCH-CLI"
          />
          <Route
            component={ChiaGuiGuidePage}
            path="/get-started/:ticker/XCH-GUI"
          />
          <Route
            component={MineableCoinGuidePage}
            path="/get-started/:ticker/:hw"
          />
          <Route
            component={MiningCoinSelectTypePage}
            path="/get-started/:ticker"
          />
          <Redirect to="/get-started" />
        </Switch> */}
      </Content>
    </Page>
  );
};

export default GetStartedPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'get-started'])),
      // Will be passed to the page component as props
    },
  };
}
