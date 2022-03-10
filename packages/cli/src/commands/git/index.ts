import { gitlogPromise } from 'gitlog'
import { execa } from 'execa'
import dayjs from 'dayjs'
import clipboard from 'clipboardy'
import { consola } from '@chenyueban/utils'

import type { Choice, Chain, Question } from '../../utils'

/**
 * 获取当天的 git commits
 * @returns {gitlog.CommitBaseWithFiles}
 */
async function git() {
  const { stdout: author } = await execa('git', ['config', 'user.name'])
  return gitlogPromise({
    repo: '.',
    author,
    since: dayjs().startOf('date').toISOString(),
    until: dayjs().endOf('date').toISOString(),
  })
}

export const choice: Choice = {
  title: 'Git commits today',
  description: '获取当前目录今日提交的 git commits',
  value: 'git',
}
export const chain: Chain = {
  type: 'select',
  name: 'git',
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
        const str = (await git()).map((commit) => commit.subject).join('\n')
        clipboard.write(str)
        consola.info('已经帮你复制好啦~ \n', str)
      },
    },
    {
      name: 'full',
      fn: async () => {
        const commits = await git()
        consola.info(commits)
      },
    },
  ],
}
export const question: Question = {
  name: 'git',
  chain,
}
