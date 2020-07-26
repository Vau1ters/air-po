import { Behaviour } from '../behaviour'

export type ExecuteResult = 'Success' | 'Failure'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const concurrent = function*(behaviourList: Array<Behaviour<any>>): Behaviour<void> {
  while (!behaviourList.every(behaviour => behaviour.next().done)) {
    yield
  }
}

export const parallel = function*(
  behaviourList: Array<Behaviour<ExecuteResult>>
): Behaviour<ExecuteResult> {
  while (true) {
    let hasAllDone = true
    for (const behaviour of behaviourList) {
      const result = behaviour.next()
      hasAllDone = hasAllDone && !!result.done
      if (result.value === 'Failure') {
        return 'Failure'
      }
    }
    if (hasAllDone) {
      return 'Success'
    }
    yield
  }
}

export const select = function*(
  behaviourList: Array<Behaviour<ExecuteResult>>
): Behaviour<ExecuteResult> {
  for (const behaviour of behaviourList) {
    const result = yield* behaviour
    if (result === 'Success') {
      return 'Success'
    }
  }
  return 'Failure'
}

export const sequence = function*(
  behaviourList: Array<Behaviour<ExecuteResult>>
): Behaviour<ExecuteResult> {
  for (const behaviour of behaviourList) {
    const result = yield* behaviour
    if (result === 'Failure') {
      return 'Failure'
    }
  }
  return 'Success'
}
