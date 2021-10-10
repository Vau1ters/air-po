import { Entity } from '@core/ecs/entity'
import { mouseCursorAI } from '@game/ai/entity/mouseCursor/mouseCursorAI'
import { AiComponent } from '@game/components/aiComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class MouseCursorFactory extends EntityFactory {
  public create(): Entity {
    const entity = loadEntity('mouseCursor')
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Ai', new AiComponent(mouseCursorAI(entity)))
    return entity
  }
}
