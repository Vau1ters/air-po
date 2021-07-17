import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from '../entityFactory'
import { EntityName, loadEntity } from '../loader/EntityLoader'

export class TileEntityFactory extends EntityFactory {
  constructor(
    private pos: Vec2,
    private name: EntityName,
    protected frame: number,
    protected world: World
  ) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity(this.name)
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    return entity
  }
}
