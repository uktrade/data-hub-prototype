const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/.tmp/dist`,
  outputStyles: `${projectDir}/.tmp/dist/stylesheets`,
  outputJS: `${projectDir}/.tmp/dist/javascripts`,
  sourceStyles: `${projectDir}/source/stylesheets`,
  sourceJS: `${projectDir}/source/javascripts`,
  webpackConfig: `${projectDir}/webpack.config.js`
};
