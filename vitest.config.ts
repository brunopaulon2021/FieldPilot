import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: { provider: "v8", reporter: ["text", "json", "html"] },
  },
  resolve: { alias: { "@": `${import.meta.dirname}/src` } },
});
