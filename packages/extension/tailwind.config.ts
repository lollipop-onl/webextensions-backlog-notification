import type { Config } from "tailwindcss";
import sharedConfig from "tailwind-config";

const config: Partial<Config> = {
  presets: [sharedConfig],
};

export default config;
