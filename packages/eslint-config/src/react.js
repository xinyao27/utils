module.exports = {
  extends: [
    'plugin:react/recommended',
    './typescript.js',
  ],
  settings: {
    react: {
      version: '17.0',
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
  },
}
