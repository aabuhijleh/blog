import { plugin as shadcn } from "@shadcn/lint";
import tsParser from "@typescript-eslint/parser";
import * as astroParser from "astro-eslint-parser";
import type { Linter } from "eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const settings = {
  shadcn: {
    ui: ["~/components", "~/layouts"],
  },
};

const rules: Linter.RulesRecord = {
  "shadcn/no-restyle": ["error", { allow: ["layout"] }],
  "shadcn/no-raw-colors": ["error", { allow: ["text-body", "text-h*"] }],
  "shadcn/no-arbitrary-values": ["error", { allow: ["content-['']"] }],
  "shadcn/no-inline-styles": "error",
  "shadcn/no-unknown-classes": "error",
  "shadcn/require-static-classes": "error",
};

export default defineConfig([
  globalIgnores([".astro/", "dist/", "public/"]),
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
    plugins: { shadcn },
    settings,
    rules,
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    settings,
    rules,
  },
]);
