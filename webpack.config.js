const webpack = require('webpack');
const path = require('path');
var paths = require('./gulp/paths');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
  context: path.join(__dirname, './client'),
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
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      paths.sourceJS,
      'node_modules',
      'node_modules/mojular/node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    })
  ]
};
