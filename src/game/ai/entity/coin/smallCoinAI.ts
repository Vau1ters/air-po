import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { kill } from '../common/action/kill'
import * as Sound from '@core/sound/sound'
import { parallelAny } from '@core/behaviour/composite'
import { waitPlayer } from '../common/action/waitPlayer'

const increaseCoinCount = (world: World): void => {
  const player = getSingleton('Player', world)
  player.getComponent('Player').smallCoinCount++
}

export const smallCoinAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* parallelAny([
    waitPlayer(entity),
    animate({ entity, state: 'Normal', loopCount: Infinity }),
  ])
  increaseCoinCount(world)
  Sound.play('smallCoin')
  yield* kill(entity, world)
}
