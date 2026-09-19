import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import { plugin as shadcn } from "@shadcn/lint";
import type { Linter } from "eslint";
import prettier from "eslint-config-prettier/flat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import astro from "eslint-plugin-astro";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const scripts = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

const settings = {
  shadcn: {
    ui: ["~/components", "~/layouts"],
  },
  "import-x/core-modules": ["astro:assets", "astro:content", "astro:transitions"],
  "import-x/resolver-next": [createTypeScriptImportResolver({ project: "./tsconfig.json" })],
};

const plugins = {
  shadcn,
  unicorn,
  "import-x": importX,
  "@typescript-eslint": tseslint.plugin,
};

const rules: Linter.RulesRecord = {
  "shadcn/no-restyle": ["error", { allow: ["layout"] }],
  "shadcn/no-raw-colors": ["error", { allow: ["text-body", "text-h*"] }],
  "shadcn/no-arbitrary-values": ["error", { allow: ["content-['']"] }],
  "shadcn/no-unknown-classes": "error",
  "shadcn/require-static-classes": "error",

  "block-scoped-var": "error",
  "no-caller": "error",
  "no-eval": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-implied-eval": "error",
  "no-iterator": "error",
  "no-new": "error",
  "no-underscore-dangle": "error",
  "no-unmodified-loop-condition": "error",
  "no-unneeded-ternary": "error",
  "no-useless-concat": "error",
  "no-useless-rename": "error",
  "preserve-caught-error": "error",
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["../**/*"],
          message: "Use the ~/ alias instead of reaching up out of the current directory.",
        },
      ],
    },
  ],

  "@typescript-eslint/array-type": ["error", { default: "generic" }],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      ignoreRestSiblings: true,
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-confusing-non-null-assertion": "error",
  "@typescript-eslint/no-dupe-class-members": "error",
  "@typescript-eslint/no-extraneous-class": "error",
  "@typescript-eslint/no-loss-of-precision": "error",
  "@typescript-eslint/no-shadow": "error",
  "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
  "@typescript-eslint/no-unused-expressions": "error",
  "@typescript-eslint/no-useless-constructor": "error",
  "@typescript-eslint/no-useless-empty-export": "error",

  "import-x/default": "error",
  "import-x/namespace": "error",
  "import-x/no-absolute-path": "error",
  "import-x/no-empty-named-blocks": "error",
  "import-x/no-named-as-default": "error",
  "import-x/no-named-as-default-member": "error",
  "import-x/no-self-import": "error",
  "import-x/no-unassigned-import": ["error", { allow: ["**/*.css"] }],

  "jsx-a11y/lang": "error",
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  "jsx-a11y/prefer-tag-over-role": "error",

  "unicorn/consistent-function-scoping": "error",
  "unicorn/no-accessor-recursion": "error",
  "unicorn/no-array-fill-with-reference-type": "error",
  "unicorn/no-array-reverse": "error",
  "unicorn/no-array-sort": "error",
  "unicorn/no-await-in-promise-methods": "error",
  "unicorn/no-confusing-array-with": "error",
  "unicorn/no-empty-file": "error",
  "unicorn/no-instanceof-builtins": "error",
  "unicorn/no-invalid-fetch-options": "error",
  "unicorn/no-invalid-remove-event-listener": "error",
  "unicorn/no-new-array": "error",
  "unicorn/no-single-promise-in-promise-methods": "error",
  "unicorn/no-thenable": "error",
  "unicorn/no-unnecessary-await": "error",
  "unicorn/no-useless-fallback-in-spread": "error",
  "unicorn/no-useless-length-check": "error",
  "unicorn/no-useless-spread": "error",
  "unicorn/prefer-add-event-listener": "error",
  "unicorn/prefer-set-size": "error",
  "unicorn/prefer-string-starts-ends-with": "error",
  "unicorn/require-module-specifiers": "error",
  "unicorn/require-post-message-target-origin": "error",
};

export default defineConfig([
  globalIgnores([".astro/", "dist/", "public/", "src/assets/"]),
  {
    files: scripts,
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"],
      eslintReact.configs["recommended-typescript"],
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins,
    settings,
    rules: { ...rules, "@eslint-react/naming-convention-ref-name": "off" },
  },
  {
    files: ["**/*.astro"],
    extends: [astro.configs["flat/recommended"], astro.configs["flat/jsx-a11y-recommended"]],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
      globals: globals.browser,
    },
    plugins: { ...plugins, "jsx-a11y": jsxA11y },
    settings,
    rules,
  },
  prettier,
]);
