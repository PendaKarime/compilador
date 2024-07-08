import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js", "**/*.test.js"],
    ignores: ["**/*.config.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      semi: "error",
      "prefer-const": "error"
    }
  },

  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,

];