import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  treeshake: true,
  splitting: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"],
  ...options,
}));
