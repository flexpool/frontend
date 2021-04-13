import './normalize.scss';
import './App.scss';
import React from 'react';
import createReduxStore from 'src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { NavBar } from 'src/components/layout/NavBar';
import { ThemeProvider } from 'styled-components/macro';
import { mainTheme } from './styledTheme';
import { FooterSection } from 'src/sections/Footer.section';

import './init';
import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import { localStorage } from 'src/utils/localStorage';
import { AppState } from 'src/rdx/rootReducer';

import { AppTheme } from './AppTheme';
import { SnackViewControl } from 'src/components/Snacks/SnackViewControl';

/**
 * Pages
 */
// const GetStartedPage = React.lazy(
//   () => import('../pages/GetStarted/GetStarted.page')
// );
// const ContactUsPage = React.lazy(
//   () => import('../pages/ContactUs/ContactUs.page')
// );
// const BrandAssetsPage = React.lazy(
//   () => import('../pages/BrandAssets/BrandAssets.page')
// );
// const StatisticsPage = React.lazy(
//   () => import('../pages/Statistics/Statistics.page')
// );
// const MinerDashboardPage = React.lazy(
//   () => import('../pages/MinerDashboard/MinerDashboard.page')
// );
// const HomePage = React.lazy(() => import('../pages/Home/Home.page'));
// const SupportPage = React.lazy(() => import('../pages/Support/Support.page'));
// const MinersPage = React.lazy(() => import('../pages/Miners/Miners.page'));
// const BlocksPage = React.lazy(() => import('../pages/Blocks/Blocks.page'));
// const FaqPage = React.lazy(() => import('../pages/Faq/Faq.page'));

import GetStartedPage from '../pages/GetStarted/GetStarted.page';
import ContactUsPage from '../pages/ContactUs/ContactUs.page';
import BrandAssetsPage from '../pages/BrandAssets/BrandAssets.page';
import StatisticsPage from '../pages/Statistics/Statistics.page';
import MinerDashboardPage from '../pages/MinerDashboard/MinerDashboard.page';
import HomePage from '../pages/Home/Home.page';
import SupportPage from '../pages/Support/Support.page';
import MinersPage from '../pages/Miners/Miners.page';
import BlocksPage from '../pages/Blocks/Blocks.page';
import FaqPage from '../pages/Faq/Faq.page';
import OpenDataReportsPage from 'src/pages/Reports/OpenDataReports.page';
import PartnersPage from 'src/pages/Partners/Partners.page';
import BusinessDevelopmentPage from 'src/pages/BusinessDevelopment/BusinessDevelopment.page';

/**
 * init redux state
 */

const cachedState = localStorage<AppState>('app_state').get() || {};
const store = createReduxStore(cachedState);

const AppContent = () => {
  const location = useLocation<{ noscroll?: boolean } | null>();
  // initial load of /pool/coins
  usePoolCoins();

  // hash
  React.useLayoutEffect(() => {
    const hash = location.hash;
    setTimeout(() => {
      const scrollToEl = document.getElementById(hash.replace('#', ''));
      if (scrollToEl) {
        window.scrollTo({
          top: scrollToEl.getBoundingClientRect().top - 80 + window.scrollY,
          left: 0,
          behavior: 'smooth',
        });
      }
    }, 50);
  }, [location.hash]);

  // location

  React.useLayoutEffect(() => {
    if (location.state?.noscroll) {
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.pathname, location.state]);

  return (
    <>
      <AppTheme />
      <NavBar />
      <SnackViewControl />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route
            exact
            component={OpenDataReportsPage}
            path="/open-data-reports"
          />
          <Route
            exact
            path="/business-development"
            component={BusinessDevelopmentPage}
          />
          <Route exact path="/partners" component={PartnersPage} />
          <Route component={GetStartedPage} path="/get-started" />
          <Route exact component={StatisticsPage} path="/statistics" />
          <Route exact component={FaqPage} path="/faq" />
          <Route exact component={MinersPage} path="/miners" />
          <Route component={MinerDashboardPage} path="/miner/:coin/:address" />
          <Route exact component={BlocksPage} path="/blocks" />
          <Route exact component={SupportPage} path="/support" />
          <Route exact component={BrandAssetsPage} path="/brand-assets" />
          <Route exact component={ContactUsPage} path="/contact" />
          <Route exact component={HomePage} path="/" />
          <Redirect to="/" />
        </Switch>
      </React.Suspense>
      <FooterSection />
    </>
  );
};

const App = () => {
  return (
    <>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <Helmet titleTemplate="%s | Flexpool.io" />
          <ThemeProvider theme={mainTheme}>
            <Router>
              <AppContent />
            </Router>
          </ThemeProvider>
        </ReduxProvider>
      </HelmetProvider>
    </>
  );
};

export default App;

// __remove force deploy
