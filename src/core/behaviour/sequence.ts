import { Behaviour } from './behaviour'
import { wait } from './wait'

export const sequent = function* <T>(
  sequence: Array<Behaviour<T>>,
  delay: number
): Behaviour<void> {
  for (const behavior of sequence) {
    yield* behavior
    yield* wait.frame(delay)
  }
}
