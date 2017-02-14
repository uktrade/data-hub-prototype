const webpack = require('webpack')

const prod = process.env.NODE_ENV === 'production'
const replaceCompanyService =
  new webpack.NormalModuleReplacementPlugin(/companyservice.js$/, 'remotecompanyservice.js')
const replaceContactService =
  new webpack.NormalModuleReplacementPlugin(/contactservice.js$/, 'remotecontactservice.js')

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',

  entry: {
    company: './src/pages/company.js',
    contact: './src/pages/contact.js',
    index: './src/pages/index.js',
    search: './src/pages/search.js',
    sectors: './src/controls/sectors.js'
  },
  output: {
    path: 'build/javascripts',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: './babel_cache',
          babelrc: false,
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      'app',
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
      sourceMap: false,
      dead_code: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    replaceCompanyService, replaceContactService
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    replaceCompanyService, replaceContactService
  ]
}
