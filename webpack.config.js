const webpack = require('webpack');
const paths = require('./gulp/paths');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'cheap-module-source-map',

  entry: {
    app: `${paths.sourceJS}/main.js`,
    search: `${paths.sourceJS}/search.js`
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
          // 'react-hot',
          'babel-loader'
        ]
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'})
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js' })
  ]
};
