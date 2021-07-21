import '../src/index.css';
import { Provider as ReduxProvider } from 'react-redux';
import createReduxStore from '../src/rdx/createStore';
import { localStorage } from '../src/utils/localStorage';
import { searchAddressStorage } from '../src/components/SearchAddressBar/searchCache';
import { AppState } from '../src/rdx/rootReducer';
import type { AppProps } from 'next/app';

// import reportWebVitals from '../src/reportWebVitals';

// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
// import { isProd } from '../src/utils/devUtils';
// import '../src/i18n';

// if (isProd()) {
//   Sentry.init({
//     dsn:
//       'https://2a9294c2decc4d1c806fd0720f50204c@o719233.ingest.sentry.io/5780995',
//     integrations: [new Integrations.BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
//   });
// }
const cachedState = localStorage<AppState>('app_state').get() || {};
const addressSearchState = searchAddressStorage.get();
const store = createReduxStore({
  ...cachedState,
  addressSearch: addressSearchState || [],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

// reportWebVitals();
