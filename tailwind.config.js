// @ts-check

/** @type {Partial<import('tailwindcss/tailwind-config').TailwindConfig>} */
const config = {
  mode: 'jit',
  purge: [
    './src/**/*.{html,tsx,ts}'
  ],
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
      }
    }
  },
};

module.exports = config;
