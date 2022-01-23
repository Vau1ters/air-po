import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'
import { loadDrawComponent } from '@game/entities/loader/component/DrawComponentLoader'

const waitPlayer = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  let shouldWait = true
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    if (args.other.tag.has('PlayerSensor')) {
      shouldWait = false
    }
  })
  yield* suspendable(() => shouldWait, animate({ entity, state: 'Normal', loopCount: Infinity }))
}

const playGetAnimation = function* (entity: Entity): Behaviour<void> {
  const pos = entity.getComponent('Position')

  yield* ease(Out.quad)(
    100,
    (value: number) => {
      pos.y = value
    },
    { from: pos.y, to: pos.y - 20 }
  )
}

export const largeCoinAI = function* (entity: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const stagePoint = entity.getComponent('StagePoint')
  const isDummy = player
    .getComponent('Player')
    .acquiredLargeCoinList.has(stagePoint.stagePoint.pointID)

  if (isDummy) {
    entity.removeComponent('Draw')
    entity.addComponent(
      'Draw',
      loadDrawComponent(
        {
          name: 'coinLargeDummy',
        },
        entity
      )
    )
  }

  yield* waitPlayer(entity)
  player.getComponent('Player').acquiredLargeCoinList.add(stagePoint.stagePoint.pointID)
  Sound.play('largeCoin')
  yield* playGetAnimation(entity)
  yield* kill(entity, world)
}
