import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './src/manifest.json' assert { type: 'json' };

export default defineConfig({
  root: fileURLToPath(new URL('src', import.meta.url)),
  plugins: [tsconfigPaths(), react(), crx({ manifest })],
});
