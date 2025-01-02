// @ts-check
import lineClamp from '@tailwindcss/line-clamp';

const config = {
  mode: 'jit',
  content: ['./components/**/*.{html,tsx,ts}'],
  darkMode: 'media',
  theme: {
    screens: {
      sm: null,
      md: '480px',
      lg: null,
      xl: null,
      '2xl': null,
    },
    extend: {
      colors: {
        // @ts-expect-error
        backlog: '#40cfa0',
        'priority-high': '#f42858',
        'priority-medium': '#4488c5',
        'priority-low': '#5eb5a6',
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
