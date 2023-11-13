import backlogPlugin from "tailwindcss-backlog";

/** @type {import('tailwindcss/types/config').Config} */
const config = {
  content: ["src/**/*.{ts,tsx}", "*.html"],
  plugins: [backlogPlugin],
};

export default config;
