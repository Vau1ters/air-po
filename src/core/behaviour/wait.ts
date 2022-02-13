import { Collider, CollisionCallbackArgs } from '@game/components/colliderComponent'
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
  collision: function* (
    collider: Collider,
    option?: { allowNoCollision: boolean }
  ): Behaviour<Array<CollisionCallbackArgs>> {
    const result: Array<CollisionCallbackArgs> = []
    const callback = (args: CollisionCallbackArgs): void => {
      result.push(args)
    }
    collider.notifier.addObserver(callback)
    if (option?.allowNoCollision ?? false) {
      yield // wait for being callback called
    } else {
      yield* wait.until((): boolean => result.length > 0)
    }
    collider.notifier.removeObserver(callback)
    return result
  },
}
