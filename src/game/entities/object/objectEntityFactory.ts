import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { PositionComponent } from '@game/components/positionComponent'
import { MapObject } from '@game/map/mapBuilder'
import { EntityFactory } from '../entityFactory'
import { EntityName, loadEntity } from '../loader/EntityLoader'

export class ObjectEntityFactory extends EntityFactory {
  constructor(private name: EntityName, protected object: MapObject, protected world: World) {
    super()
  }

  create(): Entity {
    const entity = loadEntity(this.name)
    const pos = ObjectEntityFactory.calcPosition(this.object)
    entity.addComponent('Position', new PositionComponent(pos.x, pos.y))
    return entity
  }

  public static calcPosition(object: MapObject): Vec2 {
    const { x, y, width, height, ellipse } = object
    return new Vec2(x + width / 2, ellipse ? y + height / 2 : y - height / 2)
  }
}
