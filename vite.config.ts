import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.config';

export default defineConfig({
  plugins: [tsconfigPaths(), react(), crx({ manifest })],
});
