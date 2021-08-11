const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['cs', 'en-US', 'en-GB', 'fr', 'nl', 'ru', 'pt-BR', 'zh-CN'],
    localePath: path.resolve('./public/locales'),
  },
};
