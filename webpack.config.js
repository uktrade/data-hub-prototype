const webpack = require('webpack');

const prod = process.env.NODE_ENV === 'production';
const moduleReplacementPlugin =
  new webpack.NormalModuleReplacementPlugin(/companyrepository.js$/, 'remotecompanyrepository.js');

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'source-map',

  entry: {
    company: './src/pages/company.page.js',
    contact: './src/pages/contact.js',
    contactedit: './src/pages/contactedit.js',
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
    moduleReplacementPlugin,
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    moduleReplacementPlugin,
  ],
};
