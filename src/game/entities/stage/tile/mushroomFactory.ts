import { Entity } from '@core/ecs/entity'
import { mushroomAI } from '@game/ai/entity/mushroom/mushroomAI'
import { AIComponent } from '@game/components/aiComponent'
import { SoundComponent } from '@game/components/soundComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class MushroomFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent('AI', new AIComponent(mushroomAI(entity, this.world)))
    entity.addComponent('Sound', new SoundComponent())

    const airHolder = entity.getComponent('AirHolder')
    const colliders = entity.getComponent('Collider').colliders.slice(0, 2)
    for (const c of colliders) {
      c.condition = (): boolean => airHolder.quantity > 0
    }

    if (this.frame === 0) airHolder.quantity = airHolder.maxQuantity

    return entity
  }
}
