import { gitlogPromise as git } from 'gitlog'
import { execa } from 'execa'
import dayjs from 'dayjs'

/**
 * 获取当天的 git commits
 * @returns {gitlog.CommitBaseWithFiles}
 */
export async function todayGitCommits() {
  const { stdout: author } = await execa('git', ['config', 'user.name'])
  return git({
    repo: '.',
    author,
    since: dayjs().startOf('date').toISOString(),
    until: dayjs().endOf('date').toISOString(),
  })
}
