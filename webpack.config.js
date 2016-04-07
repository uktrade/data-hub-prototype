var webpack = require('webpack');
var paths = require('./gulp/paths');

module.exports = {
  entry: {
    app: './source/javascripts/main.js',
    polyfills: ['JSON2', 'html5shiv']
  },

  output: {
    path: paths.output,
    filename: 'javascripts/[name].bundle.js'
  },

  devtool: 'cheap-module-source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        include: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'node_modules/mojular/node_modules'
    ],
    extensions: ['', '.json', '.js']
  },

  plugins: [
    new webpack.optimize.DedupePlugin()
  ]
};
