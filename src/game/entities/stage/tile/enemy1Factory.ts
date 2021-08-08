import { Entity } from '@core/ecs/entity'
import { enemy1AI } from '@game/ai/entity/enemy1/enemy1AI'
import { AiComponent } from '@game/components/aiComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Enemy1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('Ai', new AiComponent(enemy1AI(entity, this.world)))
    return entity
  }
}
