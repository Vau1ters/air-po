import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'

const waitPlayer = function*(entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  let shouldWait = true
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    if (args.other.tag.has('PlayerSensor')) {
      shouldWait = false
    }
  })
  yield* suspendable(() => shouldWait, animate({ entity, state: 'Normal', loopCount: Infinity }))
}

const increaseCoinCount = (world: World): void => {
  const player = getSingleton('Player', world)
  player.getComponent('Player').coinCount.small++
}

export const smallCoinAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* waitPlayer(entity)
  increaseCoinCount(world)
  Sound.play('smallCoin')
  yield* kill(entity, world)
}
