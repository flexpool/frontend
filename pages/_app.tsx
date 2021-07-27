import '../src/index.css';
import '../src/App/normalize.scss';
import '../src/App/App.scss';
import { appWithTranslation } from 'next-i18next';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import createReduxStore from '../src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import { localStorage } from '../src/utils/localStorage';
import { AppState } from '../src/rdx/rootReducer';

import type { AppProps } from 'next/app';

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
// import reportWebVitals from '../src/reportWebVitals';
// import { SnackViewControl } from '../src/components/Snacks/SnackViewControl';
// import { usePwaInit } from '../src/App/PwaInit';

import { usePoolCoins } from '../src/rdx/poolCoins/poolCoins.hooks';

let cachedState;
let addressSearchState;

if (typeof window !== 'undefined') {
  cachedState = localStorage<AppState>('app_state').get() || {};
  addressSearchState = searchAddressStorage.get();
}

const store = createReduxStore({
  ...cachedState,
  addressSearch: addressSearchState || [],
});

const App = ({ Component, pageProps, router }: AppProps) => {
  // usePwaInit();

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
          <SwitchTransition>
            <CSSTransition
              classNames="fade"
              key={router.route}
              in={true}
              exit={false}
              timeout={1000}
            >
              <Component {...pageProps} />
            </CSSTransition>
          </SwitchTransition>

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
