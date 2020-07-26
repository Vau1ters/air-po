import { Behaviour } from '../behaviourNode'

export const waitNode = (duration: number) =>
  function*(): Behaviour {
    for (let time = 0; time < duration; time++) {
      yield
    }
    return 'Success'
  }
