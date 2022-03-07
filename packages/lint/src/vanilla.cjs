const rules = require('./rules.cjs')

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      modules: true,
    },
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules,
}
