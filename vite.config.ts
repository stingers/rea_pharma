import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /* VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }), */
    /* legacy({
      targets: ["defaults", "not IE 11"],
    }), */
  ],
  optimizeDeps: { include: ["pdfmake/build/pdfmake", "pdfmake/build/vfs_fonts"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // generate manifest.json in outDir
    manifest: true,
    // outDir: "./dist/cpa",
    // outDir: "./dist/eqeer",
  },

  /* resolve: {
    alias: {
      crypto: "./node_modules/sockjs-client/lib/utils/browser-crypto.js",
    },
  }, */
});
