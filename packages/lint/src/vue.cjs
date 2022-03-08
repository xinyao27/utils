const rules = require('./rules.cjs')

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  rules: {
    ...rules,
  },
}
