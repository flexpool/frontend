const rewireFrontmatterMarkdown = require('react-app-rewire-frontmatter-markdown');

module.exports = function override(config, env) {
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
