const { i18n } = require('./next-i18next.config');

const withTM = require('next-transpile-modules')(['@amcharts/amcharts4/']);

module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'frontmatter-markdown-loader',
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/:lang/stats',
        destination: '/statistics',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/blocks',
        destination: '/blocks',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/miners',
        destination: '/miners',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/docs/api',
        destination: '/docs/api',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/docs/help',
        destination: '/get-started',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/docs/getting-started',
        destination: '/get-started',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/docs/nicehash-guide',
        destination: '/get-started/eth/nicehash',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/efficiency-and-shares',
        destination: '/get-started/eth/nicehash',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/contact',
        destination: '/support',
        permanent: true,
        locale: false,
      },
      {
        source: '/:lang/opendata',
        destination: '/open-data-reports',
        permanent: true,
        locale: false,
      },
    ];
  },
  i18n: {
    locales: ['cs', 'en-US', 'fr', 'nl', 'ru', 'pt-BR', 'sv-SE', 'zh-CN'],
    defaultLocale: 'en-US',
  },
});
