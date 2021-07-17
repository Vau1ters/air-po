import { EntityFactory } from './entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { Vec2 } from '@core/math/vec2'
import { AIComponent } from '@game/components/aiComponent'
import { PickupTargetComponent } from '@game/components/pickupTargetComponent'
import { World } from '@core/ecs/world'
import { dandelionFluffAI } from '@game/ai/entity/dandelion/dandelionFluffAI'
import { loadEntity } from './loader/EntityLoader'

const EMIT_POS_DIFF = new Vec2(0, 16)

export class DandelionFluffFactory extends EntityFactory {
  constructor(private world: World, private parent: Entity) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity('dandelionFluff')

    entity.addComponent('AI', new AIComponent(dandelionFluffAI(entity, this.world)))
    entity.addComponent(
      'Position',
      new PositionComponent().add(this.parent.getComponent('Position').add(EMIT_POS_DIFF))
    )
    entity.addComponent('PickupTarget', new PickupTargetComponent(false))
    entity.getComponent('Draw').zIndex = -100
    return entity
  }
}
