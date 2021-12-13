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
import useCheckUserRegion from '@/hooks/useCheckUserRegion';
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
  const isChinaRegion = useCheckUserRegion('zh');

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
            {isChinaRegion && (
              <>
                <AnnouncementBar id="doh-mode">
                  亚洲直連挖礦連接：
                  <br />
                  TCP端口：hke.fpmirror.com:13271
                  <br />
                  SSL端口：hke.fpmirror.com:5555
                  <br />
                  亚洲备用地址： web.fpmirror.com
                  <br />
                  請注意，挖掘連接可能會更改。
                  如果您想永久避免所有限制，請通過HTTPS（DoH）配寘DNS並使用eth-hke.flexpool.io
                </AnnouncementBar>
                <AnnouncementBar variant="warning" id="stale-rate-warning">
                  注意：我们近期发现部分中国大陆用户的Stale
                  Rate(过期率)有增高。我们正在努力解决该问题，谢谢您的理解。
                </AnnouncementBar>
              </>
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
