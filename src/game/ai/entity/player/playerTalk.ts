import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { FukidashiFactory } from '@game/entities/fukidashiFactory'
import { KeyController } from '@game/systems/controlSystem'

export const playerTalk = function*(entity: Entity, world: World): Behaviour<void> {
  while (true) {
    if (KeyController.isKeyPressed('X')) {
      const fukidashi = new FukidashiFactory('aaaa', entity).create()
      world.addEntity(fukidashi)
    }
    if (KeyController.isKeyPressed('C')) {
      const fukidashi = new FukidashiFactory('a\na\na\na', entity).create()
      world.addEntity(fukidashi)
    }
    if (KeyController.isKeyPressed('V')) {
      const fukidashi = new FukidashiFactory('a\naaaaaaaaaaaaaaaaaaaaaa', entity).create()
      world.addEntity(fukidashi)
    }
    yield
  }
}
