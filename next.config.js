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

    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    return config;
  },

  i18n: {
    locales: ['cs', 'en-US', 'fr', 'nl', 'ru', 'pt-BR', 'sv-SE', 'zh-CN'],
    defaultLocale: 'en-US',
  },

  async redirects() {
    return [
      // {
      //   source: '/:lang/stats',
      //   destination: '/:lang/statistics/:lang',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/blocks',
      //   destination: '/:lang/blocks',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/miners',
      //   destination: '/:lang/miners',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/docs/api',
      //   destination: '/:lang/docs/api',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/docs/help',
      //   destination: '/:lang/get-started',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/docs/getting-started',
      //   destination: '/:lang/get-started',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/docs/nicehash-guide',
      //   destination: '/:lang/get-started/eth/nicehash',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/efficiency-and-shares',
      //   destination: '/:lang/get-started/eth/nicehash',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/contact',
      //   destination: '/:lang/support',
      //   permanent: true,
      // },
      // {
      //   source: '/:lang/opendata',
      //   destination: '/:lang/open-data-reports',
      //   permanent: true,
      // },
    ];
  },
});
