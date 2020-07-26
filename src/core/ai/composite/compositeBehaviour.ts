import { Behaviour } from '../behaviour'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parallel = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (!behaviourList.every(behaviour => behaviour.next().done)) {
    yield
  }
}
