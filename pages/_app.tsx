import '../src/index.css';
import '../src/App/normalize.scss';
import '../src/App/App.scss';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

import createReduxStore from '../src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import { localStorage } from '../src/utils/localStorage';
import { AppState } from '../src/rdx/rootReducer';

import type { AppProps } from 'next/app';
import { motion } from 'framer-motion';

// import { I18n } from '../src/App/I18n';
import ServiceWorkerWrapper from '../src/App/ServiceWorkerWrapper';

// Theme
import { ThemeProvider } from 'styled-components';
import { AppTheme } from '../src/App/AppTheme';
import { mainTheme } from '../src/App/styledTheme';

// Components
import { NavBar } from '../src/components/layout/NavBar';
import { FooterSection } from '../src/sections/Footer.section';
import { searchAddressStorage } from '../src/components/SearchAddressBar/searchCache';
import CookieConsent from '../src/components/CookieConsent';
// import { SnackViewControl } from '../src/components/Snacks/SnackViewControl';

import reportWebVitals from '../src/reportWebVitals';
// import { usePwaInit } from '../src/App/PwaInit';

import { isProd } from '../src/utils/devUtils';
import { usePoolCoins } from '../src/rdx/poolCoins/poolCoins.hooks';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

if (isProd()) {
  Sentry.init({
    dsn:
      'https://2a9294c2decc4d1c806fd0720f50204c@o719233.ingest.sentry.io/5780995',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const cachedState = localStorage<AppState>('app_state').get() || {};
const addressSearchState = searchAddressStorage.get();
const store = createReduxStore({
  ...cachedState,
  addressSearch: addressSearchState || [],
});

const App = ({ Component, pageProps, router }: AppProps) => {
  // usePwaInit();
  // const { locale } = router;
  const languageCookie = localStorage<string>('lng').get();
  const { i18n } = useTranslation();

  return (
    <>
      <ServiceWorkerWrapper />
      <ReduxProvider store={store}>
        <ThemeProvider theme={mainTheme}>
          {/* <SnackViewControl /> */}
          {/* <div className="full-page-loader">
            <img
              width="200"
              loading="lazy"
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool.io logo"
            />
          </div> */}
          <PoolCoins />
          <NavBar />
          <AppTheme />
          <motion.div
            key={router.route}
            initial="pageInitial"
            animate="pageAnimate"
            variants={{
              pageInitial: {
                opacity: 0,
              },
              pageAnimate: {
                opacity: 1,
              },
            }}
          >
            <Component {...pageProps} />
          </motion.div>
          <CookieConsent />

          <FooterSection />
        </ThemeProvider>
      </ReduxProvider>
    </>
  );
};

export default appWithTranslation(App);

const PoolCoins = () => {
  usePoolCoins();

  return <></>;
};

reportWebVitals();
