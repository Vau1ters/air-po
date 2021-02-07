import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { FukidashiFactory } from '@game/entities/fukidashiFactory'
import { KeyController } from '@game/systems/controlSystem'

export const playerTalk = function*(entity: Entity, world: World): Behaviour<void> {
  const cameraFamily = new FamilyBuilder(world).include('Camera').build()
  const [camera] = cameraFamily.entityArray
  const talk = (serif: string): void => {
    world.addEntity(new FukidashiFactory(serif, entity, camera).create())
  }
  while (true) {
    if (KeyController.isKeyPressed('X')) {
      talk('わーい！うんち！うんち！')
    }
    if (KeyController.isKeyPressed('C')) {
      talk('a\nu\nd\nj')
    }
    if (KeyController.isKeyPressed('V')) {
      talk('Windows　でコンピュータのせかいがひろがります。')
    }
    yield
  }
}
