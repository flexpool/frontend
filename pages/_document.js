import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

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
            href="https://js.intercomcdn.com"
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
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="apple-mobile-web-app-title" content="Flexpool.io" />
          <meta name="application-name" content="Flexpool.io" />
          <meta name="msapplication-TileColor" content="#312e2e" />
          <meta name="theme-color" content="#ffffff" />

          <Script
            async
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
            async
            src="https://xtwj9bs7n2j9.statuspage.io/embed/script.js"
          />

          <Script
            onLoad={() => {
              window.intercomSettings = {
                app_id: 'fdj6l8hj',
              };
            }}
          />

          <Script
            id="ze-snippet"
            src="https://static.zdassets.com/ekr/snippet.js?key=d3afb9ee-8238-4043-b961-08e6c726a8f0"
          />

          <Script
            onLoad={() => {
              (function () {
                var w = window;
                var ic = w.Intercom;
                if (typeof ic === 'function') {
                  ic('reattach_activator');
                  ic('update', w.intercomSettings);
                } else {
                  var d = document;
                  var i = function () {
                    i.c(arguments);
                  };
                  i.q = [];
                  i.c = function (args) {
                    i.q.push(args);
                  };
                  w.Intercom = i;
                  var l = function () {
                    var s = d.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://widget.intercom.io/widget/fdj6l8hj';
                    var x = d.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                  };
                  if (w.attachEvent) {
                    w.attachEvent('onload', l);
                  } else {
                    w.addEventListener('load', l, false);
                  }
                }
              })();
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
