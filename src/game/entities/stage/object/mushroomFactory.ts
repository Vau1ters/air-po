import { Entity } from '@core/ecs/entity'
import { mushroomAI } from '@game/ai/entity/mushroom/mushroomAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'

export default class MushroomFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Ai', new AiComponent(entity, mushroomAI(entity, this.world)))

    const airHolder = entity.getComponent('AirHolder')
    const colliders = entity.getComponent('Collider').colliders.slice(0, 2)
    for (const c of colliders) {
      c.condition = (): boolean => airHolder.quantity > 0
    }

    if (this.frame === 0) airHolder.quantity = airHolder.maxQuantity

    return entity
  }
}
