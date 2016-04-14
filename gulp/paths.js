const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/build`,
  outputStyles: `${projectDir}/build/stylesheets`,
  outputJS: `${projectDir}/build/javascripts`,
  sourceStyles: `${projectDir}/stylesheets`,
  sourceJS: `${projectDir}/javascripts`,
  webpackConfig: `${projectDir}/webpack.config.js`
};
