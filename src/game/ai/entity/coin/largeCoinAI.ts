import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { parallelAny } from '@core/behaviour/composite'
import { GamingFilter } from '@game/filters/gamingFilter'
import { CoinGetEffectFactory } from '@game/entities/effect/coinGetEffectFactory'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'
import { loadDrawComponent } from '@game/entities/loader/component/DrawComponentLoader'

const waitPlayer = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  while (true) {
    const collisionResults = yield* wait.collision(collider)
    if (collisionResults.find(r => r.other.tag.has('PlayerSensor'))) return
  }
}

const largeCoinMainAI = function* (
  entity: Entity,
  world: World,
  filter: GamingFilter
): Behaviour<void> {
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

  yield* parallelAny([
    waitPlayer(entity),
    animate({ entity, state: 'Normal', loopCount: Infinity }),
  ])
  player.getComponent('Player').acquiredLargeCoinList.add(stagePoint.stagePoint.pointID)
  Sound.play('largeCoin')
  for (let i = 0; i < 10; i++) {
    world.addEntity(new CoinGetEffectFactory(entity, world, filter, i).create())
  }
  yield* animate({ entity, state: 'Breaking', loopCount: 1 })
  yield* kill(entity, world)
}

export const gamingAI = function* (entity: Entity, filter: GamingFilter): Behaviour<void> {
  const draw = entity.getComponent('Draw')

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
  const filter = new GamingFilter()
  yield* parallelAny([largeCoinMainAI(entity, world, filter), gamingAI(entity, filter)])
}
