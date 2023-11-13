import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss/types/config').PluginCreator} */
const main = () => {};

/** @type {import('tailwindcss/types/config').ThemeConfig} */
const theme = {
  colors: {
    brand: "#40cfa0",
    priority: {
      high: "#f42858",
      medium: "#4488c5",
      low: "#5eb5a6",
    },
  },
};

export default plugin(main, { theme });
