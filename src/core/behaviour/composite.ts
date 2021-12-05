import { assert } from '@utils/assertion'
import { Behaviour } from './behaviour'

export const parallelAll = function*<T>(behaviourList: Array<Behaviour<T>>): Behaviour<Array<T>> {
  while (true) {
    const results = behaviourList.map(behaviour => behaviour.next())
    const hasAllDone = results.every(result => result.done === true)
    if (hasAllDone)
      return results.map(result => {
        assert(result.done === true, '')
        return result.value
      })
    yield
  }
}

export const parallelAny = function*<T>(
  behaviourList: Array<Behaviour<T>>
): Behaviour<Array<T | undefined>> {
  while (true) {
    const results = behaviourList.map(behaviour => behaviour.next())
    const hasAnyDone = results.some(result => !!result.done)
    if (hasAnyDone) return results.map(result => (result.done ? result.value : undefined))
    yield
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chain = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  for (const behaviour of behaviourList) {
    yield* behaviour
  }
}
