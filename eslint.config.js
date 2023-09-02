import { defineFlatConfig } from 'eslint-define-config'
import { all } from './packages/eslint-config/src/index.js'

export default defineFlatConfig([
  ...all,
  { ignores: ['index.js, index.mjs'] },
])
