// @ts-check

require('dotenv').config()

const path = require('path');
const { template } = require('lodash');
const { EnvironmentPlugin, ProgressPlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ProvidePlugin } = require('webpack');

const { NODE_ENV } = process.env
const DIST_PATH = path.resolve(__dirname, 'dist');
const STATIC_PATH = path.resolve(__dirname, 'src/static');
const TEMPLATE_PATH = path.resolve(__dirname, 'src/templates');

/** @type {import('webpack').Configuration} */
const config = {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
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
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.png$/,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin(),
    ],
    extensions: ['.js', '.ts', '.tsx']
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  },
  plugins: [
    new ProgressPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
    new EnvironmentPlugin(['BACKLOG_API_KEY', 'BACKLOG_SPACE_ID']),
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
        { from: STATIC_PATH, to: DIST_PATH },
        {
          from: TEMPLATE_PATH,
          to: DIST_PATH,
          transform: (content, absoluteFrom) => {
            // manifest.json のテンプレートを処理する
            if (path.basename(absoluteFrom) === 'manifest.json') {
              const compiled = template(content.toString());
  
              return compiled({
                version: process.env.npm_package_version,
                versionName: 'Tenjin',
                description: process.env.npm_package_description,
              });
            };

            return content;
          },
        },
      ]
    }),
  ],
};

module.exports = config;
