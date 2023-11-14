import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['src/**/*.{ts,tsx}', '*.html'],
  theme: {
    extend: {
      colors: {
        backlog: '#40cfa0',
        priority: {
          high: '#f42858',
          medium: '#4488c5',
          low: '#5eb5a6',
        },
      },
    },
  },
  plugins: [],
};

export default config;
