import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'
import { parallelAny } from '@core/behaviour/composite'
import { waitPlayer } from '../common/action/waitPlayer'

const recovery = (world: World): void => {
  const player = getSingleton('Player', world)
  player.getComponent('Hp').increase(1)
}

export const heartAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* parallelAny([
    waitPlayer(entity),
    animate({ entity, state: 'Normal', loopCount: Infinity }),
  ])
  recovery(world)
  Sound.play('smallCoin')
  yield* kill(entity, world)
}
