import { assert } from '@utils/assertion'
import { Behaviour } from './behaviour'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallelAll = function* <T extends Array<any>>(behaviourList: {
  [P in keyof T]: Behaviour<T[P]>
}): Behaviour<T> {
  while (true) {
    const results = behaviourList.map(behaviour => behaviour.next())
    const hasAllDone = results.every(result => result.done === true)
    if (hasAllDone) {
      return results.map(result => {
        assert(result.done === true, '')
        return result.value
      }) as T
    }
    yield
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallelAny = function* <T extends Array<any>>(behaviourList: {
  [P in keyof T]: Behaviour<T[P]>
}): Behaviour<Partial<T>> {
  while (true) {
    const results = behaviourList.map(behaviour => behaviour.next())
    const hasAnyDone = results.some(result => !!result.done)
    if (hasAnyDone) {
      return results.map(result => (result.done ? result.value : undefined)) as Partial<T>
    }
    yield
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chain = function* (behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  for (const behaviour of behaviourList) {
    yield* behaviour
  }
}
