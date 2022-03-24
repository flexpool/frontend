const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: [
      'cs-CZ',
      'en-US',
      'en-GB',
      'fr-FR',
      'nl-NL',
      'ru-RU',
      'pt-BR',
      'zh-CN',
      'uk-UA',
    ],
    localePath: path.resolve('./public/locales'),
  },
};
