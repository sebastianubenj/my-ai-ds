/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dsSrc = path.resolve(import.meta.dirname, "../../packages/ds/src");

function resolveDsHashAlias(): Plugin {
  return {
    name: "resolve-ds-hash-alias",
    resolveId(id) {
      if (id.startsWith("#/")) return path.join(dsSrc, id.slice(2));
    },
  };
}

export default defineConfig({
  plugins: [resolveDsHashAlias(), react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${path.resolve(import.meta.dirname, "./src")}/` },
      {
        find: "@weaveui/ds/styles.css",
        replacement: path.resolve(dsSrc, "index.css"),
      },
      {
        find: "@weaveui/ds",
        replacement: path.resolve(dsSrc, "index.ts"),
      },
    ],
  },
  server: {
    fs: {
      allow: [path.resolve(import.meta.dirname, "../..")],
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
            commands: {
              emulateReducedMotion: async (context, value: "reduce" | "no-preference") => {
                await context.page.emulateMedia({ reducedMotion: value });
              },
            },
          },
        },
      },
    ],
  },
});
