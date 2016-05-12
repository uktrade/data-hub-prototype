var webpack = require('webpack');
var paths = require('./gulp/paths');
var prod = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: `${paths.sourceJS}/main.js`,
    polyfills: ['JSON2', 'html5shiv']
  },

  output: {
    path: paths.outputJS,
    filename: '[name].bundle.js'
  },

  devtool: 'cheap-module-source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-rest-spread', 'transform-class-properties', 'transform-runtime']
        }
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  },

  plugins: prod ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }}),
    new webpack.optimize.DedupePlugin()]
    : [new webpack.optimize.DedupePlugin()]
};
