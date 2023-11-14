import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' assert { type: 'json' };

export default defineManifest(async () => {
  return {
    manifest_version: 3,
    name: 'Backlog Ninja',
    description:
      'Backlog のお知らせや課題の更新を隠密に受け取り、スピーディーにプロジェクトや課題にアクセスできる拡張機能です。',
    version: pkg.version,
    icons: {
      '16': 'icons/icon16.png',
      '32': 'icons/icon32.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
    action: {
      default_popup: 'index.html#/popup',
    },
    permissions: ['storage'],
    host_permissions: ['https://*.backlog.com/', 'https://*.backlog.jp/'],
  };
});
