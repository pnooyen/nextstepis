import { defineConfig } from "wxt";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  vite: () => ({
    plugins: [
      svelte({
        // Using a svelte.config.js file causes a segmentation fault when importing the file
        configFile: false,
        preprocess: [vitePreprocess()],
      }),
    ],
  }),
  manifest: {
    version: "0.0.1",
    name: "nextstepis",
    permissions: ["contextMenus", "storage", "activeTab", "tabs", "sidePanel", "nativeMessaging", "scripting"],
    host_permissions: ["<all_urls>"],
    web_accessible_resources: [
      {
        resources: ["*"],
        matches: ["<all_urls>"],
      },
    ],
  },
});
