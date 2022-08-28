import { Entity } from '@core/ecs/entity'
import { cameraAI } from '@game/ai/entity/camera/cameraAI'
import { AiComponent } from '@game/components/aiComponent'
import { CameraComponent } from '@game/components/cameraComponent'
import { NameComponent } from '@game/components/nameComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'

export class CameraFactory extends EntityFactory {
  create(): Entity {
    const entity = new Entity()
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Camera', new CameraComponent([]))
    entity.addComponent('Name', new NameComponent('Camera'))
    entity.addComponent(
      'Ai',
      new AiComponent(entity, {
        behaviour: cameraAI(entity),
        dependency: {
          before: ['Player'],
        },
      })
    )
    return entity
  }
}
