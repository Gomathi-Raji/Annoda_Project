import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const vitePort = Number(env.VITE_PORT || 8080);
  const viteProxyTarget = env.VITE_PROXY_TARGET || "http://localhost:5000";

  return {
    server: {
      host: "::",
      port: Number.isNaN(vitePort) ? 8080 : vitePort,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: viteProxyTarget,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
