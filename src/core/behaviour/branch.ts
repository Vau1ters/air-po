import { Behaviour } from './behaviour'

export type BranchController = {
  transit: (name: string) => void
  finish: () => void
}

export type BranchBehaviours = {
  [key: string]: (controller: BranchController) => Behaviour<void>
}

export type BranchResult = {
  controller: BranchController
  start: (name: string) => Behaviour<void>
  by: (name: () => string) => Behaviour<void>
}

export const branch = (branches: BranchBehaviours): BranchResult => {
  let state = ''
  let done = false
  const controller = {
    transit: (name: string): void => {
      state = name
    },
    finish: (): void => {
      done = true
    },
  }
  const start = function* (name: string): Behaviour<void> {
    state = name
    const behaviours: { [key: string]: Behaviour<void> } = {}
    for (const name of Object.keys(branches)) {
      behaviours[name] = branches[name](controller)
    }
    while (!done) {
      behaviours[state].next()
      yield
    }
  }
  const by = function* (name: () => string): Behaviour<void> {
    const behaviours: { [key: string]: Behaviour<void> } = {}
    for (const name of Object.keys(branches)) {
      behaviours[name] = branches[name](controller)
    }
    while (!done) {
      behaviours[name()].next()
      yield
    }
  }
  return {
    start,
    by,
    controller,
  }
}
