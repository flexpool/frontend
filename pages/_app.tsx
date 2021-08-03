import 'src/index.css';
import 'src/App/normalize.scss';
import 'src/App/App.scss';
import { appWithTranslation } from 'next-i18next';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import createReduxStore from 'src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import { localStorage } from 'src/utils/localStorage';
import { AppState } from 'src/rdx/rootReducer';

import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

// Theme
import { ThemeProvider } from 'styled-components';
import { AppTheme } from 'src/App/AppTheme';
import { mainTheme } from 'src/App/styledTheme';

// Components
import { NavBar } from 'src/components/layout/NavBar';
import { FooterSection } from 'src/sections/Footer.section';
import { searchAddressStorage } from 'src/components/SearchAddressBar/searchCache';
import CookieConsent from 'src/components/CookieConsent';
// import { SnackViewControl } from 'src/components/Snacks/SnackViewControl';

import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import SEO from '../next-seo.config';
import Script from 'next/script';

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
  return (
    <>
      <DefaultSeo {...SEO} />
      <ReduxProvider store={store}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PWS9985F4X"
        />
        <Script
          onLoad={() => {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-PWS9985F4X');
          }}
        />

        <Script
          src="https://xtwj9bs7n2j9.statuspage.io/embed/script.js"
        />

        <Script
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=d3afb9ee-8238-4043-b961-08e6c726a8f0"
        />
        <ThemeProvider theme={mainTheme}>
          {/* <SnackViewControl /> */}
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
