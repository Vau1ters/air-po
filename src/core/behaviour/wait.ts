import { Behaviour } from './behaviour'

export const wait = function*(duration: number): Behaviour<void> {
  for (let time = 0; time < duration; time++) {
    yield
  }
}
