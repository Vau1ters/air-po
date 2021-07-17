import { Entity } from '@core/ecs/entity'
import { enemy1AI } from '@game/ai/entity/enemy1/enemy1AI'
import { AIComponent } from '@game/components/aiComponent'
import { AttackComponent } from '@game/components/attackComponent'
import { HorizontalDirectionComponent } from '@game/components/directionComponent'
import { HPComponent } from '@game/components/hpComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'

export default class Enemy1Factory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(enemy1AI(entity, this.world)))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.addComponent('HP', new HPComponent(2, 2))
    entity.addComponent('HorizontalDirection', new HorizontalDirectionComponent(entity, 'Right'))
    return entity
  }
}
