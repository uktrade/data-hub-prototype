const webpack = require('webpack');
const paths = require('./gulp/paths');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',

  entry: {
    login: `${paths.sourceJS}/pages/login.js`,
    index: `${paths.sourceJS}/pages/index.js`,
    search: `${paths.sourceJS}/pages/search.js`,
    company: `${paths.sourceJS}/pages/company.js`,
    contact: `${paths.sourceJS}/pages/contact.js`,
    interaction: `${paths.sourceJS}/pages/interaction.js`,
    companyadd: `${paths.sourceJS}/pages/companyadd.js`,
    contactedit: `${paths.sourceJS}/pages/contactedit.js`,
    interactionedit: `${paths.sourceJS}/pages/interactionedit.js`,
  },
  output: {
    path: paths.outputJS,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ],
        cacheDirectory: 'babel_cache',
        "presets": ["es2015", "react"],
        "plugins": ["transform-class-properties"]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      paths.sourceJS,
      'node_modules'
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: prod ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ]
};
