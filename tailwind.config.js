/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      md: '480px',
    },
    extend: {
      colors: {
        primary: '#40cfa0',
        'priority-high': '#f42858',
        'priority-medium': '#4488c5',
        'priority-low': '#5eb5a6',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
