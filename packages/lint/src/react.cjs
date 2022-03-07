const rules = require('./rules.cjs')

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'import', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      modules: true,
    },
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    ...rules,
    // 强制onClick伴随以下至少一项：onKeyUp，onKeyDown，onKeyPress
    'jsx-a11y/click-events-have-key-events': 'off',
    // react 需要写 prop types
    'react/prop-types': 'off',
    // 需要显示引用 React
    'react/jsx-uses-react': 'off',
    // 需要显示引用 React
    'react/react-in-jsx-scope': 'off',
    // react jsx 不允许使用 spreading
    'react/jsx-props-no-spreading': 'off',
    // react 可选 props 必须传入 default props
    'react/require-default-props': 'off',
    // https://github.com/facebook/create-react-app/issues/6880#issuecomment-485963251
    'react-hooks/exhaustive-deps': 'off',
    /**
     * https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
     * 当前阶段有问题 fix 自动使用 var
     */
    'react/function-component-definition': 'off',
  },
}
