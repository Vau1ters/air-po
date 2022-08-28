import { Behaviour } from './behaviour'

export const suspendable = function* <T>(
  condition: () => boolean,
  executionBehaviour: Behaviour<T>
): Behaviour<T | undefined> {
  while (condition()) {
    const result = executionBehaviour.next()
    if (result.done === true) return result.value
    yield
  }
  return
}
