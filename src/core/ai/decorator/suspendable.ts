import { Behaviour } from '../behaviour'

export const suspendable = function*(
  condition: () => boolean,
  executionBehaviour: Behaviour<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): Behaviour<void> {
  while (condition()) {
    const { done } = executionBehaviour.next()
    if (done) return
    yield
  }
}
