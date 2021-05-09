import { Behaviour } from './behaviour'
import { parallelAll } from './composite'
import { wait } from './wait'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shift = function*(behaviour: Behaviour<any>, delay: number): Behaviour<void> {
  yield* wait(delay)
  yield* behaviour
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sequent = function*(sequence: Behaviour<any>[], delay: number): Behaviour<void> {
  yield* parallelAll(sequence.map((behaviour, index) => shift(behaviour, delay * index)))
}
