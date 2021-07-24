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
      // {
      //   source: '/_error',
      //   destination: '/not-found',
      //   permanent: true,
      // },
    ];
  },
  i18n,
});
