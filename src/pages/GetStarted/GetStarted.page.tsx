import { Helmet } from 'react-helmet-async';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage } from './GPU/CoinGuide.page';
import { ChiaCliGuidePage } from './ChiaCli/Guide.page';
import { MineableCoinList } from './CoinList.page';
import { MiningCoinSelectTypePage } from './CoinSelectMiningType.page';
import { NicehashGuidePage } from './Nicehash/NicehashGuide.page';

export const GetStartedPage = () => {
  return (
    <Page>
      <Helmet>
        <title>Start mining with Flexpool</title>
      </Helmet>
      <Content paddingLg>
        <Switch>
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
            component={MineableCoinGuidePage}
            path="/get-started/:ticker/:hw"
          />
          <Route
            component={MiningCoinSelectTypePage}
            path="/get-started/:ticker"
          />
          <Redirect to="/get-started" />
        </Switch>
      </Content>
    </Page>
  );
};

export default GetStartedPage;
