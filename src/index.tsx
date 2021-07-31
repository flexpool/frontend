import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
import { isProd } from './utils/devUtils';
// import './i18n';

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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
