/* eslint-env node */

const Promise = require('es6-promise');
Promise.polyfill();

const webpack = require('webpack');
const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    './app/startup/serverRegistration',
  ],
  output: {
    filename: 'server-bundle.js',
    path: '../app/assets/webpack',
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /i18n\/all.js/, /routes\/routes.js/],
      },
      {
        test: /\.css$/,
        loaders: [
          'css-loader/locals?modules&importLoaders=0&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss-loader',
        ],
      },
    ],
  },
};
