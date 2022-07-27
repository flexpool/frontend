import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { resetIdCounter } from 'downshift';
import { resetIdCounter as resetTabsId } from 'react-tabs';

import { defaultReduxState } from '@/rdx/rootReducer';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    resetIdCounter();
    resetTabsId();
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    if (ctx.query.coin) {
      defaultReduxState.localSettings.coin = ctx.query.coin;
    }

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
        coinQuery: ctx.query.coin,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preconnect"
            href="https://static.flexpool.io"
            prefetch="false"
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            prefetch="false"
          />
          <link
            rel="preconnect"
            href="https://xtwj9bs7n2j9.statuspage.io"
            prefetch="false"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="apple-mobile-web-app-title" content="Flexpool.io" />
          <meta name="application-name" content="Flexpool.io" />
          <meta name="msapplication-TileColor" content="#312e2e" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <ThemeControlScript />
          <LamboDayCompatibilityScript />
          {this.props.coinQuery && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.__COIN__ = '${this.props.coinQuery}';
              `,
              }}
            />
          )}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const themeControlScript = () => {
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function setMode(mode) {
    window.__mode = mode;

    if (mode !== 'system') {
      setColor(mode);
    } else {
      setColor(darkQuery.matches ? 'dark' : 'light');
    }

    window.__onThemeChange(mode);
  }

  function setColor(color) {
    document.body.className = color; // "dark" or "light"
    window.__color = color;
    window.__onColorChange(color);
  }

  // this will be overwritten in our React component
  window.__onThemeChange = function () {};

  window.__onColorChange = function () {};

  window.__setPreferredMode = function (mode) {
    setMode(mode);
    try {
      localStorage.setItem('mode', JSON.stringify(window.__mode));
    } catch (err) {}
  };

  let preferredMode;

  try {
    preferredMode = JSON.parse(localStorage.getItem('mode'));

    if (!preferredMode) {
      // Add backward compatibility for legacy theme mode logic
      const appState = JSON.parse(localStorage.getItem('app_state'));

      if (appState) {
        preferredMode = appState?.localSettings?.colorMode;
      }
    }
  } catch (err) {}

  setMode(preferredMode || 'system');

  darkQuery.addEventListener('change', function (event) {
    if (window.__mode === 'system') {
      setColor(event.matches ? 'dark' : 'light');
    }
  });
};

function ThemeControlScript() {
  const scriptFn = `(${String(themeControlScript)})()`;

  return <script dangerouslySetInnerHTML={{ __html: scriptFn }} />;
}

// On Lambo day, we added a new currency: LAMBO,
// This script converts it back to usd for those who have used LAMBO
const lamboDayCompatibilityScript = () => {
  let appState = localStorage.getItem('app_state');
  let lamboInit = localStorage.getItem('lambo-init');

  if (appState && lamboInit === 'true') {
    try {
      let j = JSON.parse(appState);
      if (j.localSettings.counterTicker === 'lambo') {
        j.localSettings.counterTicker = 'usd';
        localStorage.setItem('app_state', JSON.stringify(j));
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Clean up flag
  if (lamboInit) {
    localStorage.removeItem('lambo-init');
  }
};

function LamboDayCompatibilityScript() {
  const scriptFn = `(${String(lamboDayCompatibilityScript)})()`;

  return <script dangerouslySetInnerHTML={{ __html: scriptFn }} />;
}
