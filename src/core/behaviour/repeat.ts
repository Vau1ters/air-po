import { Behaviour } from './behaviour'

export const repeat = function*(count: number, fun: () => void): Behaviour<void> {
  for (let i = 0; i < count; i++) {
    fun()
    yield
  }
}
