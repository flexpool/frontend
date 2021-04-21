const rewireFrontmatterMarkdown = require('react-app-rewire-frontmatter-markdown');
const path = require('path');

const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = function override(config, env) {
  console.log('ENV: ', env);

  if (env === 'production') {
    config.plugins = config.plugins.concat([
      new PrerenderSPAPlugin({
        routes: ['/'],
        staticDir: path.join(__dirname, 'build'),
      }),
    ]);
  }
  rewireFrontmatterMarkdown(config);

  /**
   * removes some of the unused dependencies that are not tree shaked by amcharts
   */
  config.externals = function (context, request, callback) {
    if (/xlsx|canvg|pdfmake/.test(request)) {
      return callback(null, 'commonjs ' + request);
    }
    callback();
  };
  return config;
};
