import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { parseAnimation } from '@core/graphics/animationParser'
import { Vec2 } from '@core/math/vec2'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { MapObject } from '@game/map/mapBuilder'
import { EntityFactory } from '../entityFactory'

export class ObjectEntityFactory extends EntityFactory {
  constructor(private name: string, protected pos: Vec2, protected world: World) {
    super()
  }

  create(): Entity {
    const entity = new Entity()
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))

    try {
      const { sprite } = require(`../../../../res/animation/${this.name}.json`) // eslint-disable-line  @typescript-eslint/no-var-requires
      entity.addComponent(
        'Draw',
        new DrawComponent({
          entity,
          child: {
            sprite: parseAnimation(sprite),
          },
        })
      )
      entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    } catch (_) {
      return entity
    }
    return entity
  }

  protected static calcPosition(object: MapObject): Vec2 {
    const { x, y, width, height } = object
    return new Vec2(x + width / 2, y - height / 2)
  }
}
