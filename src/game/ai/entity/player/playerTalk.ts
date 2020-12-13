import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { FukidashiFactory } from '@game/entities/fukidashiFactory'
import { KeyController } from '@game/systems/controlSystem'

export const playerTalk = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    if (KeyController.isKeyPressed('X')) {
      const fukidashi = new FukidashiFactory('わーい！うんち！うんち！', entity).create()
      world.addEntity(fukidashi)
    }
    if (KeyController.isKeyPressed('C')) {
      const fukidashi = new FukidashiFactory('a\nu\nd\nj', entity).create()
      world.addEntity(fukidashi)
    }
    if (KeyController.isKeyPressed('V')) {
      const fukidashi = new FukidashiFactory(
        'Windows　でコンピュータの世界が広がります。',
        entity
      ).create()
      world.addEntity(fukidashi)
    }
    yield
  }
}
