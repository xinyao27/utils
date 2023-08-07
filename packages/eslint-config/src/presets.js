import { eslintComments } from './eslint-comments.js'
import { imports, js, jsx, unicorn } from './js.js'
import { jsonc, pkgOrder } from './jsonc.js'
import { markdown } from './markdown.js'
import { GLOB_EXCLUDE } from './shared.js'
import { typescript } from './typescript.js'
import { vue } from './vue.js'
import { react } from './react.js'
import { yml } from './yml.js'

/**
 * @typedef { import('eslint-define-config').FlatESLintConfigItem } FlatESLintConfigItem
 */

/** @type {FlatESLintConfigItem[]} */
export const basic = [
  // @ts-ignore
  { ignores: GLOB_EXCLUDE },
  ...js,
  ...jsx,
  ...typescript,
  ...imports,
  ...unicorn,
  ...jsonc,
  ...pkgOrder,
  ...yml,
  ...eslintComments,
]

/** @type { FlatESLintConfigItem[] } */
export const all = [...vue, ...react, ...basic]

/** @type {(config?: FlatESLintConfigItem | FlatESLintConfigItem[], enables?: Partial<{
 * vue: boolean
 * markdown: boolean
 * }>) => FlatESLintConfigItem[]} */
export function chenyueban(
  config = [],
  {
    vue: enableVue = true,
    markdown: enableMarkdown = true,
  } = {},
) {
  const configs = []
  configs.push(...basic)
  if (enableVue !== false) {
    configs.push(...vue)
  }
  if (enableMarkdown !== false) {
    configs.push(...markdown)
  }
  if (Object.keys(config).length > 0) {
    configs.push(...(Array.isArray(config) ? config : [config]))
  }
  return configs
}
