import webpack from 'webpack';
import merge from 'webpack-merge';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import config from './webpack.config';

export default merge<webpack.Configuration>(config, {
  mode: 'production',
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  }
});