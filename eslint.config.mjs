// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Apply ESLint's recommended rules
  js.configs.recommended,

  {
    // 2. Define files to lint (and files to ignore like node_modules or build folders)
    files: ["src/**/*.js", "*.js"],

    languageOptions: {
      ecmaVersion: "latest", // Allows modern JavaScript features
      sourceType: "module", // Enforces ESM syntax (import/export)
      globals: {
        ...globals.node, // Enables Node.js globals (process, Buffer, etc.)
      },
    },

    rules: {
      // 3. Customize your rules here
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Useful for Express middleware next()
      "no-console": "off", // Allows console.log for backend monitoring
      "prefer-const": "error", // Enforces clean variable declarations
      "import/extensions": ["error", "always", { js: "always" }],
    },
  },
];
