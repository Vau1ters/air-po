import { Behaviour } from '@core/behaviour/behaviour'
import { Collider, CollisionCallbackArgs } from '@game/components/colliderComponent'

export const getCollisionResult = function*(
  collider: Collider
): Behaviour<Array<CollisionCallbackArgs>> {
  const result: Array<CollisionCallbackArgs> = []
  const callback = (args: CollisionCallbackArgs): void => {
    result.push(args)
  }
  collider.callbacks.add(callback)
  yield // wait for being callback called
  collider.callbacks.delete(callback)
  return result
}
