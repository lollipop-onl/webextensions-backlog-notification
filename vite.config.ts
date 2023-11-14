import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import webExtension from 'vite-plugin-web-extension';
import { manifest } from './src/manifest.config';

export default defineConfig({
  root: 'src',
  build: {
    outDir: fileURLToPath(new URL('dist', import.meta.url)),
  },
  plugins: [tsconfigPaths(), react(), webExtension({ manifest })],
});
