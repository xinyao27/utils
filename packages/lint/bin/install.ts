#!/usr/bin/env node
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { pkgUp } from 'pkg-up'
import { execa } from 'execa'
import prompts, { type PromptObject } from 'prompts'

import { error, setNpmScripts, bootstrap, BootstrapConfig } from './utils.js'
import {
  CZRC,
  COMMITLINTRC,
  ESLINTRC_VANILLA,
  ESLINTRC_REACT,
  ESLINTRC_VUE,
  PRETTIERRC,
  NPMRC,
  EDITOR_CONFIG,
  LINTSTAGEDRC,
  RELEASE_IT,
  GITIGNORE,
} from './raw.js'

const basePackages: BootstrapConfig[] = [
  {
    afterInstall: async (cwd) => {
      await setNpmScripts(cwd, { 'update:deps': 'pnpm update -i --latest' })
    },
  },
  {
    configFile: {
      configFileName: `.npmrc`,
      configFileRaw: NPMRC,
    },
  },
  {
    configFile: {
      configFileName: `.editorconfig`,
      configFileRaw: EDITOR_CONFIG,
    },
  },
]
const commitPackages: BootstrapConfig[] = [
  {
    configFile: {
      configFileName: `.gitignore`,
      configFileRaw: GITIGNORE,
    },
  },
  {
    packageName: `commitizen`,
  },
  {
    packageName: `cz-conventional-changelog`,
    configFile: {
      configFileName: `.czrc`,
      configFileRaw: CZRC,
    },
  },
  {
    packageName: `@commitlint/cli`,
    configFile: {
      configFileName: `.commitlintrc`,
      configFileRaw: COMMITLINTRC,
    },
  },
]
const lintPackages: BootstrapConfig[] = [
  {
    packageName: `eslint`,
  },
  {
    packageName: `prettier`,
    configFile: {
      configFileName: `.prettierrc`,
      configFileRaw: PRETTIERRC,
    },
  },
]
const toolsPackages: BootstrapConfig[] = [
  {
    packageName: `husky`,
    afterInstall: async (cwd) => {
      await setNpmScripts(cwd, { prepare: 'husky install' })
      await execa('npm', ['run', 'prepare'], { cwd })
      if (existsSync(path.join(cwd, '.husky/pre-commit'))) {
        const preCommit = await fs.readFile(
          path.join(cwd, '.husky/pre-commit'),
          {
            encoding: 'utf-8',
          }
        )
        if (!preCommit.includes('npx lint-staged')) {
          await execa(
            'npx',
            ['husky', 'add', '.husky/pre-commit', 'npx lint-staged'],
            { cwd }
          )
        }
      } else {
        await execa(
          'npx',
          ['husky', 'add', '.husky/pre-commit', 'npx lint-staged'],
          { cwd }
        )
      }
      await execa('git', ['add', '.husky/pre-commit'], { cwd })
    },
  },
  {
    packageName: `lint-staged`,
    configFile: {
      configFileName: `.lintstagedrc`,
      configFileRaw: LINTSTAGEDRC,
    },
  },
]
interface Chain extends PromptObject {
  name: string
  actions: BootstrapConfig[]
}
const chain: Chain[] = [
  {
    name: 'base',
    type: 'toggle',
    message: '.npmrc and .editorconfig',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: basePackages,
  },
  {
    name: 'commit',
    type: 'toggle',
    message: 'git cz and commitlint',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: commitPackages,
  },
  {
    name: 'lint',
    type: 'toggle',
    message: 'eslint and prettier',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: lintPackages,
  },
  {
    name: 'lintType',
    type: (prev) => (prev ? 'select' : null),
    message: 'choose the framework',
    initial: 0,
    choices: [
      {
        title: 'vanilla',
        description: 'vanilla',
        value: 'vanilla',
      },
      {
        title: 'react',
        description: 'react',
        value: 'react',
      },
      {
        title: 'vue',
        description: 'vue',
        value: 'vue',
      },
    ],
    actions: [
      {
        name: `vanilla`,
        configFile: {
          configFileName: `.eslintrc`,
          configFileRaw: ESLINTRC_VANILLA,
        },
      },
      {
        name: `react`,
        configFile: {
          configFileName: `.eslintrc`,
          configFileRaw: ESLINTRC_REACT,
        },
      },
      {
        name: `vue`,
        configFile: {
          configFileName: `.eslintrc`,
          configFileRaw: ESLINTRC_VUE,
        },
      },
    ],
  },
  {
    name: 'tools',
    type: 'toggle',
    message: 'husky and lint-staged',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: toolsPackages,
  },
  {
    name: 'release',
    type: 'toggle',
    message: 'release-it or changesets',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: [],
  },
  {
    name: 'releaseType',
    type: (prev) => (prev ? 'select' : null),
    message: 'choose the version tool',
    initial: 0,
    choices: [
      {
        title: 'release-it',
        description: 'release-it',
        value: 'release-it',
      },
      {
        title: 'changesets',
        description: 'changesets',
        value: 'changesets',
      },
    ],
    actions: [
      {
        name: 'release-it',
        packageName: `release-it`,
        afterInstall: async (cwd) => {
          await setNpmScripts(cwd, { release: 'release-it' })
        },
        configFile: {
          configFileName: `.release-it.json`,
          configFileRaw: RELEASE_IT,
        },
      },
      {
        name: 'release-it',
        packageName: `@release-it/conventional-changelog`,
      },
      {
        name: 'changesets',
        packageName: `@changesets/cli`,
        afterInstall: async (cwd) => {
          await execa('npx', ['changeset', 'init'], { cwd })
        },
      },
    ],
  },
]

async function main() {
  const cwd = process.cwd()
  const pkgFile = await pkgUp({ cwd })
  if (!pkgFile) {
    return 0
  }
  const pkgDir = path.dirname(pkgFile)

  const response = await prompts(chain)

  for (const name in response) {
    if (Object.prototype.hasOwnProperty.call(response, name)) {
      const config = chain.find((v) => v.name === name)
      if (config) {
        if (config.name === 'lintType') {
          await bootstrap(
            pkgDir,
            config.actions.filter((v) => v.name === response[name])
          )
        } else {
          await bootstrap(pkgDir, config.actions)
        }
      }
    }
  }

  return 0
}

main()
  .then(process.exit)
  .catch((e) => {
    error(e)
    process.exit(1)
  })
