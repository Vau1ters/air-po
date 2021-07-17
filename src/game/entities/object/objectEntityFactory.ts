import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { createSprite, SpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { MapObject } from '@game/map/mapBuilder'
import { EntityFactory } from '../entityFactory'

export class ObjectEntityFactory extends EntityFactory {
  constructor(private name: SpriteName, protected object: MapObject, protected world: World) {
    super()
  }

  create(): Entity {
    const entity = new Entity()
    const pos = ObjectEntityFactory.calcPosition(this.object)
    entity.addComponent('Position', new PositionComponent(pos.x, pos.y))

    try {
      entity.addComponent(
        'Draw',
        new DrawComponent({
          entity,
          child: {
            sprite: createSprite(this.name),
          },
        })
      )
      entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    } catch (_) {
      return entity
    }
    return entity
  }

  public static calcPosition(object: MapObject): Vec2 {
    const { x, y, width, height, ellipse } = object
    return new Vec2(x + width / 2, ellipse ? y + height / 2 : y - height / 2)
  }
}
