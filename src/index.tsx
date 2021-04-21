import React from 'react';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';
// import { isProd } from './utils/devUtils';

// if (isProd()) {
//   Sentry.init({
//     dsn:
//       'https://221f5e7217f649bf80dde0f9d47946be@o574572.ingest.sentry.io/5725753',
//     integrations: [new Integrations.BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
//   });
// }

import { hydrate, render } from 'react-dom';

const rootElement = document.getElementById('root');
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
