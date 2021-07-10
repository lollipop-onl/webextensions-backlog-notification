// @ts-check

const path = require('path');
const { template, transform } = require('lodash');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DIST_PATH = path.resolve(__dirname, 'dist');
const STATIC_PATH = path.resolve(__dirname, 'src/static');
const TEMPLATE_PATH = path.resolve(__dirname, 'src/templates');

/** @type {import('webpack').Configuration & { devServer: import('webpack-dev-server').Configuration }} */
const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    contentBase: STATIC_PATH,
    compress: true,
    port: 43000,
  },
  entry: {
    popup: './src/scripts/popup.tsx',
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
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
    new HTMLWebpackPlugin({
      title: 'Backlog Notification Extension',
      filename: 'popup.html',
      chunks: ['popup'],
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
