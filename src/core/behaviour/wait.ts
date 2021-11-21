import { Behaviour } from './behaviour'

export const wait = {
  frame: function*(duration: number): Behaviour<void> {
    for (let time = 0; time < duration; time++) {
      yield
    }
  },
  until: function*(cond: () => boolean): Behaviour<void> {
    while (!cond()) {
      yield
    }
  },
}
