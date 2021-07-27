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
      {/* <ServiceWorkerWrapper /> */}
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
            transition={{ type: 'ease-in-out' }}
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
