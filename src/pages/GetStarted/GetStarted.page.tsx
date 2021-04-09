import { Helmet } from 'react-helmet-async';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { MineableCoinGuidePage } from './CoinGuide';
import { MineableCoinList } from './CoinList';
import { MiningCoinSelectTypePage } from './CoinSelectMiningType';

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
