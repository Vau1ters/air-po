import { Behaviour } from '../behaviour'
export const suspendable = function*(
  conditionBehaviour: () => Behaviour<boolean>,
  executionBehaviour: Behaviour<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): Behaviour<void> {
  while (yield* conditionBehaviour()) {
    const { done } = executionBehaviour.next()
    if (done) return
    yield
  }
}
