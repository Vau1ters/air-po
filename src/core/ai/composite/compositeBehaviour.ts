import { Behaviour } from '../behaviour'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallel = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (true) {
    const hasAllDone = behaviourList.map(behaviour => behaviour.next().done).every(done => !!done)
    if (hasAllDone) break
    yield
  }
}
