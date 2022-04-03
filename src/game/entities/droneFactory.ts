import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { droneAI } from '@game/ai/entity/drone/droneAI'
import { AiComponent } from '@game/components/aiComponent'
import { NameComponent } from '@game/components/nameComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class DroneFactory extends EntityFactory {
  constructor(private world: World) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('drone')

    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Ai', new AiComponent(droneAI(entity, this.world)))
    entity.addComponent('Sound', new SoundComponent())
    entity.addComponent('Name', new NameComponent('Drone'))

    return entity
  }
}
