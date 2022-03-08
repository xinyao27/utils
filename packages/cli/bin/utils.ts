import type { Answers, PromptObject } from 'prompts'

export interface Action {
  name?: string
  fn?: (cwd?: string) => Promise<void>
}
export interface Chain extends PromptObject {
  actions?: Action[]
}
export function getActionsFromResponse(response: Answers<any>, chain: Chain[]) {
  if (response.action) {
    const actions = chain.find((item) => item.name === response.action)?.actions
    if (actions) {
      return actions.find((item) => item.name === response[response.action])?.fn
    }
  }
  return null
}
