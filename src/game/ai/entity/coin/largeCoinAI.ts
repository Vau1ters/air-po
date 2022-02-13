import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { Out } from '@core/behaviour/easing/functions'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'
import { loadDrawComponent } from '@game/entities/loader/component/DrawComponentLoader'
import { wait } from '@core/behaviour/wait'
import { parallelAny } from '@core/behaviour/composite'
import { GamingFilter } from '@game/filters/gamingFilter'

const waitPlayer = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  let shouldWait = true
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    if (args.other.tag.has('PlayerSensor')) {
      shouldWait = false
    }
  })
  yield* wait.until((): boolean => shouldWait === false)
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

const largeCoinMainAI = function* (entity: Entity, world: World): Behaviour<void> {
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

export const gamingAI = function* (entity: Entity): Behaviour<void> {
  const draw = entity.getComponent('Draw')

  const filter = new GamingFilter()
  draw.filters = [filter]

  let phase = 0
  while (true) {
    // H ぐるぐる
    // S 60/100
    // V 100
    filter.dstColor = [
      1 - 0.6 * (Math.sin(phase + (0 / 3) * Math.PI) * 0.5 + 0.5),
      1 - 0.6 * (Math.sin(phase + (2 / 3) * Math.PI) * 0.5 + 0.5),
      1 - 0.6 * (Math.sin(phase + (4 / 3) * Math.PI) * 0.5 + 0.5),
    ]
    phase += 0.1
    yield
  }
}

export const largeCoinAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* parallelAny([
    largeCoinMainAI(entity, world),
    animate({ entity, state: 'Normal', loopCount: Infinity }),
    gamingAI(entity),
  ])
}
