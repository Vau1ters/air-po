import { assert } from '@utils/assertion'
import { EventNotifier } from '@utils/eventNotifier'
import { Behaviour } from './behaviour'

export const wait = {
  frame: function* (duration: number): Behaviour<void> {
    for (let time = 0; time < duration; time++) {
      yield
    }
  },
  until: function* (cond: () => boolean): Behaviour<void> {
    while (!cond()) {
      yield
    }
  },
  untilDefined: function* <T, K extends keyof T>(
    base: T,
    key: K
  ): Behaviour<Exclude<T[K], undefined>> {
    while (base[key] === undefined) yield
    return base[key] as Exclude<T[K], undefined>
  },
  notification: function* <T>(notifier: EventNotifier<T>): Behaviour<T> {
    type State = { done: boolean; value?: T }
    let state: State = { done: false }
    const callback = (value: T): void => {
      state = { done: true, value }
    }
    notifier.addObserver(callback)
    yield* wait.until((): boolean => state.done === true)
    notifier.removeObserver(callback)
    assert(state.done === true, '')
    assert('value' in state, '')
    return state.value as T
  },
}
