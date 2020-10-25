import { Behaviour } from '../behaviour'

export const transition = function*(
  duration: number,
  callback: (currentTime: number) => void
): Behaviour<void> {
  for (let time = 0; time < duration; time++) {
    callback(time)
    yield
  }
}
