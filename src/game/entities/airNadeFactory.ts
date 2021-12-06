import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { loadEntity } from './loader/EntityLoader'
import { airNadeAI } from '@game/ai/entity/airNade/airNadeAI'
import { World } from '@core/ecs/world'
import { AiComponent } from '@game/components/aiComponent'

const SETTING = {
  forwardSpeed: 100,
  upSpeed: 100,
}

export class AirNadeFactory extends EntityFactory {
  constructor(public player: Entity, public world: World) {
    super()
  }

  public create(): Entity {
    const playerPos = this.player.getComponent('Position')
    const playerDir = this.player.getComponent('HorizontalDirection')

    const entity = loadEntity('airNade')
    const rigidBody = entity.getComponent('RigidBody')

    entity.addComponent('Position', new PositionComponent(playerPos.x, playerPos.y))
    entity.addComponent('Ai', new AiComponent(airNadeAI(entity, this.world)))

    rigidBody.velocity.x = playerDir.sign * SETTING.forwardSpeed
    rigidBody.velocity.y = -SETTING.upSpeed
    return entity
  }
}
