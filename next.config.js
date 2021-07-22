const { i18n } = require('./next-i18next.config');

const withTM = require('next-transpile-modules')([
  '@amcharts/amcharts4/core',
  '@amcharts/amcharts4/charts',
  '@amcharts/amcharts4/themes/animated',
]);

module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'frontmatter-markdown-loader',
    });

    return config;
  },
  i18n,
});
