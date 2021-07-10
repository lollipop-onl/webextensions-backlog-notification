// @ts-check

/** @type {Partial<import('tailwindcss/tailwind-config').TailwindConfig>} */
const config = {
  // @ts-expect-error
  mode: 'jit',
  purge: [
    './src/**/*.{html,tsx}'
  ],
};

module.exports = config;
