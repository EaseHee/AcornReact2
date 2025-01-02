import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      "import/first": "off", // import 위치 강제 규칙 비활성화
      "no-unused-expressions": "warn", // 실행되지 않는 표현식 경고만 출력
    },
  },
];