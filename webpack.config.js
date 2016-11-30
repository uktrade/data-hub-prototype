const webpack = require('webpack');

const prod = process.env.NODE_ENV === 'production';
const replaceCompanyRepo =
  new webpack.NormalModuleReplacementPlugin(/companyrepository.js$/, 'remotecompanyrepository.js');
const replaceContactRepo =
  new webpack.NormalModuleReplacementPlugin(/contactrepository.js$/, 'remotecontactrepository.js');


module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',

  entry: {
    company: './src/pages/company.js',
    contact: './src/pages/contact.js',
    index: './src/pages/index.js',
    interactionedit: './src/pages/interactionedit.js',
    login: './src/pages/login.js',
    search: './src/pages/search.js',
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
          plugins: ['transform-class-properties'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      'app',
      'node_modules',
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: prod ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
      dead_code: true,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    replaceCompanyRepo, replaceCompanyRepo,
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    replaceCompanyRepo, replaceContactRepo,
  ],
};
