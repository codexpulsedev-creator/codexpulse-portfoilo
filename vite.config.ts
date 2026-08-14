// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const ROBUST_RUNTIME_MJS = `import { createRequire } from "node:module";
//#region \\0rolldown/runtime.js
const __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
function __commonJSMin(cb, mod) {
\treturn () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
}
function __exportAll(all, no_symbols) {
\tlet target = {};
\tfor (var name in all) Object.defineProperty(target, name, {
\t\tget: all[name],
\t\tenumerable: true
\t});
\tif (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: "Module" });
\treturn target;
}
function __copyProps(to, from, except, desc) {
\tif (from && (typeof from === "object" || typeof from === "function")) {
\t\tfor (var keys = Object.getOwnPropertyNames(from), i = 0, n = keys.length, key; i < n; i++) {
\t\t\tkey = keys[i];
\t\t\tif (!Object.prototype.hasOwnProperty.call(to, key) && key !== except) {
\t\t\t\tObject.defineProperty(to, key, {
\t\t\t\t\tget: ((k) => from[k]).bind(null, key),
\t\t\t\t\tenumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable
\t\t\t\t});
\t\t\t}
\t\t}
\t}
\treturn to;
}
function __toESM(mod, isNodeMode, target) {
\ttarget = mod != null ? Object.create(Object.getPrototypeOf(mod)) : {};
\treturn __copyProps(isNodeMode || !mod || !mod.__esModule ? Object.defineProperty(target, "default", {
\t\tvalue: mod,
\t\tenumerable: true
\t}) : target, mod);
}
//#endregion
export { __toESM as i, __exportAll as n, __require as r, __commonJSMin as t };
`;

function patchRuntimeHelpers(dir: string) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        patchRuntimeHelpers(fullPath);
      } else if (entry === "_runtime.mjs" || entry.endsWith("_runtime.mjs")) {
        writeFileSync(fullPath, ROBUST_RUNTIME_MJS, "utf-8");
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
