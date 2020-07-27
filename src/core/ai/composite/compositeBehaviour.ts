import { Behaviour } from '../behaviour'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallel = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (true) {
    const allDone = behaviourList.map(behaviour => behaviour.next().done).every(b => b)
    if (allDone) return
    yield
  }
}
