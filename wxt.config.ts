import { defineConfig } from "wxt";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  manifest: {
    name: 'Backlog Notification Extension',
    version: pkg.version,
    description: pkg.description,
    permissions: ['alarms', 'storage'],
    host_permissions: [
      "https://*.backlog.com/api/v2/*",
      "https://*.backlog.jp/api/v2/*"],
    action: {},
  }
})