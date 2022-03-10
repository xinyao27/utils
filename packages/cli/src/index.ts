#!/usr/bin/env node

import { cwd, exit } from 'process'
import prompts from 'prompts'
import { consola } from '@chenyueban/utils'

import pkg from '../package.json'
import { choice as gitChoice, question as gitQuestion } from './commands/git'
import {
  choice as initialChoice,
  question as initialQuestion,
} from './commands/initial'
import { type Chain, getActionsFromResponse } from './utils'

async function main() {
  const CWD = cwd()
  const chain: Chain = [
    {
      name: 'select',
      type: 'select',
      message: `@chenyueban/cli v${pkg.version}`,
      choices: [gitChoice, initialChoice],
      initial: 0,
    },
  ]
  const question = [gitQuestion, initialQuestion]
  const response = await prompts(chain)
  const { select } = response
  const response2 = await prompts(
    question.find((v) => v.name === select)!.chain
  )
  const actions = getActionsFromResponse(
    response2,
    question.find((v) => v.name === select)!.chain
  )

  for (const action of actions) {
    await action?.(CWD)
  }
}

main().catch((e) => {
  consola.error(e)
  exit()
})
