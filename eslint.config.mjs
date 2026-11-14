import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "studio/**",
    "next-env.d.ts",
    // WASM de MediaPipe: código de terceros, no se lintamos.
    "public/mediapipe/**",
  ]),
]);
