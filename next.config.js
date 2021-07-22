const { i18n } = require('./next-i18next-config.js');

module.exports = {
  i18n,
};

const withTM = require('next-transpile-modules')([
  '@amcharts/amcharts4/core',
  '@amcharts/amcharts4/charts',
  '@amcharts/amcharts4/themes/animated',
]);

module.exports = withTM();
