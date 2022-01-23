import { Behaviour } from './behaviour'

export type BranchController<T> = {
  transit: (name: string, args?: [unknown]) => void
  finish: (arg: T) => void
}

export type BranchBehaviours<T> = {
  [key: string]: (controller: BranchController<T>) => Behaviour<void>
}

export type BranchResult<T> = {
  controller: BranchController<T>
  start: (name: string) => Behaviour<T>
  by: (name: () => string) => Behaviour<T>
}

export const branch = <T>(branches: BranchBehaviours<T>): BranchResult<T> => {
  let state = ''
  let result: { done: false } | { done: true; value: T } = { done: false }

  let args: [] | [unknown] = []

  const controller = {
    transit: (name: string, givenArgs?: [unknown]): void => {
      state = name
      args = givenArgs ?? []
    },
    finish: (arg: T): void => {
      result = { done: true, value: arg }
    },
  }
  const start = function* (name: string): Behaviour<T> {
    state = name
    const behaviours: { [key: string]: Behaviour<void> } = {}
    for (const name of Object.keys(branches)) {
      behaviours[name] = branches[name](controller)
    }
    while (!result.done) {
      behaviours[state].next(args)
      yield
    }
    return result.value
  }
  const by = function* (name: () => string): Behaviour<T> {
    const behaviours: { [key: string]: Behaviour<void> } = {}
    for (const name of Object.keys(branches)) {
      behaviours[name] = branches[name](controller)
    }
    while (!result.done) {
      behaviours[name()].next()
      yield
    }
    return result.value
  }
  return {
    start,
    by,
    controller,
  }
}
