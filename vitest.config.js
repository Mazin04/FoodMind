import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/android/**",
            "**/ios/**",
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/**/*.{js,jsx,ts,tsx}"],
            exclude: [
                "src/**/*.test.{js,jsx,ts,tsx}",
                "src/i18n.js",
                "src/constants/**",
                "**/android/**",
                "**/ios/**",
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});