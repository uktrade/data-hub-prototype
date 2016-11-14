const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/build`,
  outputStyles: `${projectDir}/build/stylesheets`,
  outputJS: `${projectDir}/build/javascripts`,
  sourceStyles: `${projectDir}/app/sass`,
  sourceJS: `${projectDir}/app`,
  react: `${projectDir}/app/react`,
  webpackConfig: `${projectDir}/webpack.config.js`,
  outputImages: `${projectDir}/build/images`,
  node_modules: `${projectDir}/node_modules`
};
