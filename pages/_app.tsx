import 'styles/normalize.scss';
import 'styles/app.scss';
import { appWithTranslation } from 'next-i18next';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClient } from '@/lib/react-query';
import createReduxStore from 'src/rdx/createStore';
import { Provider as ReduxProvider } from 'react-redux';
import { localStorage } from 'src/utils/localStorage';
import { AppState } from 'src/rdx/rootReducer';
import { useTranslation } from 'next-i18next';

import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

// Theme
import { ThemeProvider } from 'styled-components';
import { AppTheme } from 'src/App/AppTheme';
import { mainTheme } from 'src/App/styledTheme';

// Components
import NavBar from '../src/components/layout/NavBar';
import { FooterSection } from '../src/sections/Footer.section';
import { searchAddressStorage } from '../src/components/SearchAddressBar/searchCache';
import TermsConsent from '../src/components/TermsConsent';
import RouteLoader from '@/components/RouteLoader';
import useIsMounted from '@/hooks/useIsMounted';
import { SnackViewControl } from '@/components/Snacks/SnackViewControl';
import AnnouncementBar from '@/components/AnnouncementBar';

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

declare global {
  interface Window {
    dataLayer: any;
  }
}

const App = ({ Component, pageProps, router }: AppProps) => {
  const { t, i18n } = useTranslation('dashboard');
  const isMounted = useIsMounted();
  const isChineseUser =
    typeof window !== 'undefined'
      ? /^zh\b/.test(window.navigator.language) || /^zh\b/.test(i18n.language)
      : false;

  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-8XV7C3E2CB"
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-8XV7C3E2CB');
          `,
            }}
          />
          <Script src="https://xtwj9bs7n2j9.statuspage.io/embed/script.js" />

          <Script
            id="ze-snippet"
            src="https://static.zdassets.com/ekr/snippet.js?key=d3afb9ee-8238-4043-b961-08e6c726a8f0"
          />
          <ThemeProvider theme={mainTheme}>
            <SnackViewControl />
            <RouteLoader />
            <NavBar />
            {isMounted && isChineseUser && (
              <AnnouncementBar id="doh-mode">
                中国政府通过污染DNS在某些地区禁止了eth-hke.flexpool.io。
                此问题的解决方法：
                <br />
                1. 使用 hke.fpmirror.com 而不是 eth-hke.flexpool.io（SSL 端口
                5555 22271。TCP 端口 4444 13271）
                <br />
                2. 使用 DNS over HTTPS (DoH)
                <br />
                如果您无法连接到该网站，请使用替代链接： web.fpmirror.com
              </AnnouncementBar>
            )}
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

            <TermsConsent />
            <FooterSection />
          </ThemeProvider>
        </ReduxProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default appWithTranslation(App);
