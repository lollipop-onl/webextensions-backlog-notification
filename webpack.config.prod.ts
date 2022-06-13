import webpack from 'webpack';
import merge from 'webpack-merge';
import config from './webpack.config';

export default merge<webpack.Configuration>(config, {
  mode: 'production',
});