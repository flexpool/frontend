import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();

    const page = renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preconnect"
            href="https://static.flexpool.io"
            prefetch={false}
          />
          <link
            rel="preconnect"
            href="https://js.intercomcdn.com"
            prefetch={false}
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            prefetch={false}
          />
          <link
            rel="preconnect"
            href="https://xtwj9bs7n2j9.statuspage.io"
            prefetch={false}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap"
            rel="stylesheet"
            prefetch={false}
          />
          {/* <style
            dangerouslySetInnerHTML={{
              __html: `
              #__next > :not(.full-page-loader) {
                animation: fade 1s normal forwards;
                transition: 1s opacity;
              }

              .full-page-loader {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                z-index: 10;
                animation: fade 1s reverse forwards;
                transition: 1s opacity;
              }

              .full-page-loader > img {
                height: 70px;
                animation: 1.8s infinite heartbeat;
                transition: 0.2s all;
              }

              @keyframes fade {
                  from {
                      opacity: 0;
                  }
                  to {
                      opacity: 1;
                  }
              }

              @keyframes heartbeat {
                0% {
                  transform: scale(1);
                }
                25% {
                  transform: scale(1.15);
                }
                50% {
                  transform: scale(1);
                }
                75% {
                  transform: scale(1.15);
                }
                100% {
                  transform: scale(1);
                }
              }
          `,
            }}
          /> */}
          {this.props.styleTags}
        </Head>
        <body>
          {/* <div className="full-page-loader">
            <img
              width="200"
              loading="lazy"
              src="https://static.flexpool.io/assets/brand/icon.svg"
              alt="Flexpool.io logo"
            />
          </div> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
