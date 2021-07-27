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

import { NavBar } from 'src/components/layout/NavBar';
import { ThemeProvider } from 'styled-components';
import { mainTheme } from './styledTheme';
import { FooterSection } from 'src/sections/Footer.section';

import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import { localStorage } from 'src/utils/localStorage';
import { AppState } from 'src/rdx/rootReducer';

import { AppTheme } from './AppTheme';
import { SnackViewControl } from 'src/components/Snacks/SnackViewControl';
import { PageLoader } from 'src/components/layout/Page';
import ServiceWorkerWrapper from './ServiceWorkerWrapper';
import { usePwaInit } from './PwaInit';
import { searchAddressStorage } from 'src/components/SearchAddressBar/searchCache';
import { I18n } from './I18n';
import CookieConsent from 'src/components/CookieConsent';

/**
 * Pages code splitting
 */
const StatisticsPage = React.lazy(
  () => import('../pages/Statistics/Statistics.page')
);
const MinerDashboardPage = React.lazy(
  () => import('../pages/MinerDashboard/MinerDashboard.page')
);
const MinersPage = React.lazy(() => import('../pages/Miners/Miners.page'));
const BlocksPage = React.lazy(() => import('../pages/Blocks/Blocks.page'));
const GetStartedPage = React.lazy(
  () => import('../pages/GetStarted/GetStarted.page')
);
const ContactUsPage = React.lazy(
  () => import('../pages/ContactUs/ContactUs.page')
);
const BrandAssetsPage = React.lazy(
  () => import('../pages/BrandAssets/BrandAssets.page')
);
const HomePage = React.lazy(() => import('../pages/Home/Home.page'));
const SupportPage = React.lazy(() => import('../pages/Support/Support.page'));
const FaqPage = React.lazy(() => import('../pages/Faq/Faq.page'));
const NotFoundPage = React.lazy(
  () => import('../pages/NotFound/NotFound.page')
);
const BusinessDevelopmentPage = React.lazy(
  () => import('../pages/BusinessDevelopment/BusinessDevelopment.page')
);

const OpenDataReportsPage = React.lazy(
  () => import('../pages/Reports/OpenDataReports.page')
);
const PartnersPage = React.lazy(
  () => import('../pages/Partners/Partners.page')
);
const BaseOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/BaseOldUrlSupport.page')
);
const StatsOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/StatsOldUrlSupport.page')
);
const BlocksOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/BlocksOldUrlSupport.page')
);
const MinersOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/MinersOldUrlSupport.page')
);
const GetStartedOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/GetStartedOldUrlSupport.page')
);
const NicehashOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/NicehashOldUrlSupport.page')
);
const SupportOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/SupportOldUrlSupport.page')
);
const OpenDataOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/OpenDataOldUrlSupport.page')
);
const ApiDocsOldUrlSupportPage = React.lazy(
  () => import('../pages/V1Urlsupport/ApiDocsOldUrlSupport.page')
);
const ApiDocsPage = React.lazy(() => import('../pages/Docs/ApiDocs.page'));

/**
 * init redux state
 */

const cachedState = localStorage<AppState>('app_state').get() || {};
const addressSearchState = searchAddressStorage.get();
const store = createReduxStore({
  ...cachedState,
  addressSearch: addressSearchState || [],
});

const AppContent = () => {
  const location = useLocation<{ noscroll?: boolean } | null>();
  // initial load of /pool/coins
  usePoolCoins();
  usePwaInit();

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
      <ServiceWorkerWrapper />
      <AppTheme />
      <React.Suspense fallback={<React.Fragment />}>
        <NavBar />
        <SnackViewControl />
        <I18n />
      </React.Suspense>
      <React.Suspense fallback={<PageLoader />}>
        <Switch>
          <Route exact component={ApiDocsPage} path="/docs/api" />
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
          <Route path="/not-found" component={NotFoundPage} />
          <Route
            exact
            path="/:langOrAddress/"
            component={BaseOldUrlSupportPage}
          />
          <Route exact path="/:lang/stats" component={StatsOldUrlSupportPage} />
          <Route
            exact
            path="/:lang/blocks"
            component={BlocksOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/miners"
            component={MinersOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/docs/help"
            component={GetStartedOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/docs/getting-started"
            component={GetStartedOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/docs/nicehash-guide"
            component={NicehashOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/efficiency-and-shares"
            component={NicehashOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/contact"
            component={SupportOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/opendata"
            component={OpenDataOldUrlSupportPage}
          />
          <Route
            exact
            path="/:lang/docs/API"
            component={ApiDocsOldUrlSupportPage}
          />
          <Redirect to="/" />
        </Switch>
        <CookieConsent></CookieConsent>
      </React.Suspense>
      <React.Suspense fallback={<React.Fragment />}>
        {/** __TODO footer loader */}
        <FooterSection />
      </React.Suspense>
    </>
  );
};

const App = () => {
  return (
    <>
      <ReduxProvider store={store}>
        <ThemeProvider theme={mainTheme}>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ReduxProvider>
      {/* <HelmetProvider>
          <Helmet titleTemplate="%s | Flexpool.io" />
      </HelmetProvider> */}
    </>
  );
};

export default App;

// __remove force deploy
