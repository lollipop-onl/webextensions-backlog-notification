import type { StorybookConfig } from '@storybook/core-common';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src',
      files: '**/*.stories.tsx'
    }
  ],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
          postcssOptions: require('../postcss.config'),
        }
      }
    }
  ],
  typescript: {
    check: false,
  },
  framework: '@storybook/react',
  core: {
    builder: 'webpack5'
  }
};

module.exports = config;