#!/usr/bin/env node

import { exit, cwd } from 'process'
import prompts from 'prompts'
import clipboard from 'clipboardy'
import { consola } from '@chenyueban/utils'

import { todayGitCommits } from './git'
import { type Chain, getActionsFromResponse } from './utils'

const chain: Chain[] = [
  {
    type: 'select',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      {
        title: 'Git commits today',
        description: '获取当前目录今日提交的 git commits',
        value: 'gitCommitsToday',
      },
    ],
    initial: 0,
  },
  {
    type: (prev) => (prev === 'gitCommitsToday' ? 'select' : null),
    name: 'gitCommitsToday',
    message: 'What do you want to do?',
    choices: [
      {
        title: 'subject',
        description: '获取当前目录今日提交的 git commits (仅查看 subject)',
        value: 'subject',
      },
      {
        title: 'full',
        description: '获取当前目录今日提交的 git commits (查看详情数据)',
        value: 'full',
      },
    ],
    initial: 0,
    actions: [
      {
        name: 'subject',
        fn: async () => {
          const str = (await todayGitCommits())
            .map((commit) => commit.subject)
            .join('\n')
          clipboard.write(str)
          consola.log('已经帮你复制好啦~ \n', str)
        },
      },
      {
        name: 'full',
        fn: async () => {
          const commits = await todayGitCommits()
          consola.log(commits)
        },
      },
    ],
  },
]

async function main() {
  const response = await prompts(chain)
  const action = getActionsFromResponse(response, chain)
  action?.(cwd())
}

main().catch((e) => {
  consola.error(e)
  exit(1)
})
