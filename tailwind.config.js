/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./components/**/*.{html,tsx,ts}'],
  theme: {
    screens: {
      md: '480px',
    },
    extend: {
      colors: {
        backlog: '#40cfa0',
        'priority-high': '#f42858',
        'priority-medium': '#4488c5',
        'priority-low': '#5eb5a6',
      }
    }
  }
}

export default config;