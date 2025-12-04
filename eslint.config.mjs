import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        URL: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Blob: "readonly",
        HTMLCanvasElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLDivElement: "readonly",
        SVGSVGElement: "readonly",
        PerformanceObserver: "readonly",
        PerformanceEntry: "readonly",
        PerformanceNavigationTiming: "readonly",
        Notification: "readonly",
        NotificationOptions: "readonly",
        Event: "readonly",
        DOMException: "readonly",
        // Node.js globals
        process: "readonly",
        NodeJS: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        // React globals
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "no-undef": "off", // TypeScript handles this
    },
  },
  {
    files: ["src/app/image-tools/page.tsx"],
    rules: {
      "jsx-a11y/alt-text": "off",
    },
  },
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "dist/",
      "public/sw.js",
      "public/sw.js.map",
      "*.tsbuildinfo",
      ".env*",
      "*.log",
      "coverage/",
      ".vscode/",
      ".idea/",
      ".DS_Store",
      "Thumbs.db",
      "*.tmp",
      "*.temp",
    ],
  },
];
