import { Entity } from '@core/ecs/entity'
import { GameEventComponent } from '@game/components/gameEventComponent'
import { EntityFactory } from './entityFactory'

export class GameEventFactory extends EntityFactory {
  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('GameEvent', new GameEventComponent())
    return entity
  }
}
