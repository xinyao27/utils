module.exports = {
  extends: [
    './typescript.js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  settings: { react: { version: '17.0' } },
  rules: {
    'react/no-array-index-key': ['error'],
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/self-closing-comp': ['error'],

    // jsx
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': ['error'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never', propElementValues: 'always' }],
    'react/jsx-curly-newline': ['error', { multiline: 'require', singleline: 'consistent' }],
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
    'react/jsx-equals-spacing': ['error'],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-max-props-per-line': ['error'],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': ['error'],
    'react/jsx-wrap-multilines': [
      'error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
  },
}
