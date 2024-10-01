import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Notification Extension",
		description:
			"Backlog のお知らせをメニューバーから通知・確認できる Web Extension です",
		permissions: ["alarms", "storage"],
		host_permissions: ["https://*.backlog.com/*", "https://*.backlog.jp/*"],
	},
});
