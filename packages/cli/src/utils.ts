import type { Answers, PromptObject, Choice } from 'prompts'

export interface Action {
  name?: string
  fn?: (cwd: string) => Promise<void>
}

export { Choice }
interface ChainObject extends PromptObject {
  actions?: Action[]
}
export type Chain = ChainObject | ChainObject[]
export interface Question {
  name: string
  chain: Chain
}
export function getActionsFromResponse(response: Answers<any>, chain: Chain) {
  if (Array.isArray(chain)) {
    const actions: ((cwd: string) => Promise<void>)[] = []
    for (const name in response) {
      if (Object.prototype.hasOwnProperty.call(response, name)) {
        const select = response[name]
        if (select) {
          const target = chain.find((v) => v.name === name)
          if (target && target.actions) {
            target.actions.forEach((action) => {
              if (action.fn) actions.push(action.fn)
            })
          }
        }
      }
    }
    return actions
  }
  const { actions } = chain
  if (actions) {
    return [
      actions.find((item) => item.name === response[chain.name as string])?.fn,
    ].filter(Boolean)
  }
  return []
}
