import { Behaviour } from './behaviour'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallelAll = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (true) {
    const hasAllDone = behaviourList.map(behaviour => behaviour.next().done).every(done => !!done)
    if (hasAllDone) break
    yield
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallelAny = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (true) {
    const hasAnyDone = behaviourList.map(behaviour => behaviour.next().done).some(done => !!done)
    if (hasAnyDone) break
    yield
  }
}
