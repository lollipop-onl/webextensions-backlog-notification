import webpack from 'webpack';
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'development',
  devServer: {
    client: {
      progress: true,
    },
    static: {
      directory: path.join(__dirname, 'public'),
    },
    open: ['/popup.html'],
    port: 9000,
  },
  entry: {
    popup: './src/popup.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                },
                transform: {
                  react: {
                    runtime: 'automatic'
                  }
                }
              }
            },
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      }
    ]
  },
  stats: 'none',
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HTMLWebpackPlugin({
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new MiniCssExtractPlugin(),
  ]
};

export default config;