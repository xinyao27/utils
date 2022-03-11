#!/usr/bin/env node

import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { execa } from 'execa'

import type { Chain, Choice, Question } from '../../utils'
import type { BootstrapConfig } from './utils'
import { bootstrap, setNpmScripts } from './utils'
import {
  COMMITLINTRC,
  CZRC,
  EDITOR_CONFIG,
  ESLINTRC,
  GITIGNORE,
  LINTSTAGEDRC,
  NPMRC,
  RELEASE_IT,
  TSCONFIG_JSON_CONTENT,
  TSCONFIG_NODE_JSON_CONTENT,
} from './raw'

const basePackages: BootstrapConfig[] = [
  {
    afterInstall: async(cwd) => {
      if (!existsSync(path.join(cwd, '.git')))
        await execa('git', ['init'], { cwd })

      await setNpmScripts(cwd, { preinstall: 'npx only-allow pnpm' })
      await setNpmScripts(cwd, { 'update:deps': 'pnpm update -i --latest' })
    },
  },
  {
    configFile: {
      configFileName: '.npmrc',
      configFileRaw: NPMRC,
    },
  },
  {
    configFile: {
      configFileName: '.editorconfig',
      configFileRaw: EDITOR_CONFIG,
    },
  },
]
const typescriptPackages: BootstrapConfig[] = [
  {
    packageName: '@chenyueban/tsconfig',
  },
  {
    configFile: {
      configFileName: 'tsconfig.json',
      configFileRaw: TSCONFIG_JSON_CONTENT,
    },
  },
  {
    configFile: {
      configFileName: 'tsconfig.node.json',
      configFileRaw: TSCONFIG_NODE_JSON_CONTENT,
    },
  },
]
const commitPackages: BootstrapConfig[] = [
  {
    configFile: {
      configFileName: '.gitignore',
      configFileRaw: GITIGNORE,
    },
  },
  {
    packageName: 'commitizen',
  },
  {
    packageName: 'cz-conventional-changelog',
    configFile: {
      configFileName: '.czrc',
      configFileRaw: CZRC,
    },
  },
  {
    packageName: '@commitlint/cli',
    configFile: {
      configFileName: '.commitlintrc',
      configFileRaw: COMMITLINTRC,
    },
  },
]
const eslintPackages: BootstrapConfig[] = [
  {
    packageName: '@chenyueban/eslint-config',
  },
  {
    packageName: 'eslint',
  },
  {
    configFile: {
      configFileName: '.eslintrc',
      configFileRaw: ESLINTRC,
    },
  },
  {
    afterInstall: async(cwd) => {
      await setNpmScripts(cwd, { lint: 'eslint . --fix' })
    },
  },
]
const toolsPackages: BootstrapConfig[] = [
  {
    packageName: 'husky',
    afterInstall: async(cwd) => {
      await setNpmScripts(cwd, { prepare: 'husky install' })
      await execa('npm', ['run', 'prepare'], { cwd })
      if (existsSync(path.join(cwd, '.husky/pre-commit'))) {
        const preCommit = await fs.readFile(
          path.join(cwd, '.husky/pre-commit'),
          {
            encoding: 'utf-8',
          },
        )
        if (!preCommit.includes('npx lint-staged')) {
          await execa(
            'npx',
            ['husky', 'add', '.husky/pre-commit', 'npx lint-staged'],
            { cwd },
          )
        }
      }
      else {
        await execa(
          'npx',
          ['husky', 'add', '.husky/pre-commit', 'npx lint-staged'],
          { cwd },
        )
      }
      await execa('git', ['add', '.husky/pre-commit'], { cwd })
    },
  },
  {
    packageName: 'lint-staged',
    configFile: {
      configFileName: '.lintstagedrc',
      configFileRaw: LINTSTAGEDRC,
    },
  },
]

export const choice: Choice = {
  title: 'Initial',
  description: '初始化项目',
  value: 'initial',
}
export const chain: Chain = [
  {
    name: 'base',
    type: 'toggle',
    message: '.npmrc and .editorconfig',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: [
      {
        fn: async(cwd) => {
          await bootstrap(cwd, basePackages)
        },
      },
    ],
  },
  {
    name: 'typescript',
    type: 'toggle',
    message: 'typescript config (tsconfig.json)',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: [
      {
        fn: async(cwd) => {
          await bootstrap(cwd, typescriptPackages)
        },
      },
    ],
  },
  {
    name: 'commit',
    type: 'toggle',
    message: 'git cz and commitlint',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: [
      {
        fn: async(cwd) => {
          await bootstrap(cwd, commitPackages)
        },
      },
    ],
  },
  {
    name: 'eslint',
    type: 'toggle',
    message: 'eslint',
    initial: true,
    active: 'yes',
    inactive: 'no',
    actions: [
      {
        fn: async(cwd) => {
          await bootstrap(cwd, eslintPackages)
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
    actions: [
      {
        fn: async(cwd) => {
          await bootstrap(cwd, toolsPackages)
        },
      },
    ],
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
    type: prev => (prev ? 'select' : null),
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
        fn: async(cwd) => {
          await bootstrap(cwd, [
            {
              packageName: 'release-it',
              afterInstall: async(c) => {
                await setNpmScripts(c, { release: 'release-it' })
              },
              configFile: {
                configFileName: '.release-it.json',
                configFileRaw: RELEASE_IT,
              },
            },
            {
              packageName: '@release-it/conventional-changelog',
            },
          ])
        },
      },
      {
        name: 'changesets',
        fn: async(cwd) => {
          await bootstrap(cwd, [
            {
              packageName: '@changesets/cli',
              afterInstall: async(c) => {
                await execa('npx', ['changeset', 'init'], { cwd: c })
              },
            },
          ])
        },
      },
    ],
  },
]
export const question: Question = {
  name: 'initial',
  chain,
}
