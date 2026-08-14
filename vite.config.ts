// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function patchRuntimeHelpers(dir: string) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        patchRuntimeHelpers(fullPath);
      } else if (entry.endsWith(".mjs") || entry.endsWith(".js")) {
        let content = readFileSync(fullPath, "utf-8");
        if (content.includes("var __exportAll =")) {
          content = content.replace(
            /var __exportAll = \(all, no_symbols\) => \{/g,
            "function __exportAll(all, no_symbols) {",
          );
          writeFileSync(fullPath, content, "utf-8");
        }
      }
    }
  } catch {
    // Ignore errors if directory missing
  }
}

function ensureVercelOutputConfig() {
  try {
    const vercelOutputDir = join(process.cwd(), ".vercel", "output");
    if (!existsSync(vercelOutputDir)) return;

    const configPath = join(vercelOutputDir, "config.json");
    const config = {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/__server" },
      ],
    };
    writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

    const funcDir = join(vercelOutputDir, "functions", "__server.func");
    if (existsSync(funcDir)) {
      const vcConfigPath = join(funcDir, ".vc-config.json");
      const vcConfig = {
        runtime: "nodejs24.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: true,
      };
      writeFileSync(vcConfigPath, JSON.stringify(vcConfig, null, 2), "utf-8");
    }
  } catch {
    // Ignore errors if directory missing
  }
}

export default defineConfig({
  nitro: {
    preset: "vercel",
    hooks: {
      compiled(nitro) {
        if (nitro.options?.output?.dir) {
          patchRuntimeHelpers(nitro.options.output.dir);
        }
        patchRuntimeHelpers(join(process.cwd(), ".vercel"));
        patchRuntimeHelpers(join(process.cwd(), ".output"));
        ensureVercelOutputConfig();
      },
    },
  },
});
