import * as esbuild from "esbuild";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

// ESM
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "neutral",
  target: ["es2020", "node18"],
  format: "esm",
  outfile: "dist/index.js",
});

// CJS
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/index.cjs",
});

// TypeScript declarations
execSync("npx tsc --emitDeclarationOnly --declaration --outDir dist", { stdio: "inherit" });

console.log("Built → dist/index.js (ESM) · dist/index.cjs (CJS) · dist/index.d.ts");
