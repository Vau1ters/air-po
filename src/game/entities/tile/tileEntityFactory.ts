import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { createSprite, SpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { EntityFactory } from '../entityFactory'

export class TileEntityFactory extends EntityFactory {
  constructor(
    private pos: Vec2,
    private name: SpriteName,
    protected frame: number,
    protected world: World
  ) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
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
    return entity
  }
}
