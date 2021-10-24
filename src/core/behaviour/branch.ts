import { Behaviour } from './behaviour'

export type BranchController = {
  transit: (name: string) => void
  finish: () => void
}

export const branch = (branches: {
  [key: string]: (controller: BranchController) => Behaviour<void>
}): { start: (name: string) => Behaviour<void> } => {
  return {
    start: function*(name: string): Behaviour<void> {
      let state = name
      let done = false
      const controller = {
        transit: (name: string): void => {
          state = name
        },
        finish: (): void => {
          done = true
        },
      }

      const behaviours: { [key: string]: Behaviour<void> } = {}
      for (const name of Object.keys(branches)) {
        behaviours[name] = branches[name](controller)
      }
      while (!done) {
        behaviours[state].next()
        yield
      }
    },
  }
}
