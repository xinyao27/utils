import { defineFlatConfig } from 'eslint-define-config'
import { all } from '@chenyueban/eslint-config'

export default defineFlatConfig([
  ...all,
  { ignores: ['index.js, index.mjs'] },
])
