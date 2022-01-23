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
    let result: T | undefined
    const callback = (value: T): void => {
      result = value
    }
    notifier.addObserver(callback)
    yield* wait.until((): boolean => result !== undefined)
    notifier.removeObserver(callback)
    assert(result !== undefined, '')
    return result
  },
}
