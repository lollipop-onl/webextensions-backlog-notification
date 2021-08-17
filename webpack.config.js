// @ts-check

require('dotenv').config();

const path = require('path');
const { template } = require('lodash');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { NODE_ENV, npm_package_version, npm_package_description } = process.env;
const DIST_PATH = path.resolve(__dirname, 'dist');
const STATIC_PATH = path.resolve(__dirname, 'src/static');
const TEMPLATE_PATH = path.resolve(__dirname, 'src/templates');
const WEBPACK_MODE = NODE_ENV === 'production' ? 'production' : 'development'

/** @type {import('webpack').Configuration} */
const config = {
  mode: WEBPACK_MODE,
  devtool: 'source-map',
  entry: {
    popup: './src/scripts/popup.tsx',
    options: './src/scripts/options.tsx',
    background: './src/scripts/background.ts',
  },
  output: {
    filename: '[name].js',
    path: DIST_PATH,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            /** @type {Partial<import('ts-loader').Options>} */
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  stats: 'none',
  plugins: [
    // @ts-expect-error
    new WebpackBar({}),
    new FriendlyErrorsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
    new HTMLWebpackPlugin({
      title: 'Backlog Notification Extension',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HTMLWebpackPlugin({
      title: 'Backlog Notification Extension Options',
      filename: 'options.html',
      chunks: ['options'],
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: STATIC_PATH, to: DIST_PATH, noErrorOnMissing: true, globOptions: { dot: false } },
        {
          from: path.join(TEMPLATE_PATH, 'manifest.json'),
          to: DIST_PATH,
          transform: (content, absoluteFrom) => {
            const compiled = template(content.toString());

            return compiled({
              version: npm_package_version,
              description: npm_package_description,
            });
          },
        },
        {
          from: path.join(TEMPLATE_PATH, 'icons', WEBPACK_MODE),
          to: path.join(DIST_PATH, 'icons'),
        }
      ],
    }),
  ],
};

module.exports = config;
