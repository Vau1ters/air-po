import { EntityFactory } from '../entityFactory'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { AnimationStateComponent } from '@game/components/animationStateComponent'
import { Vec2 } from '@core/math/vec2'
import { createSprite, SpriteName } from '@core/graphics/art'

export class UIComponentFactory extends EntityFactory {
  private position: Vec2 = new Vec2(0, 0)
  private anchor: Vec2 = new Vec2(0, 0)

  constructor(private name: SpriteName) {
    super()
  }

  public setPosition(x: number, y: number): this {
    this.position.x = x
    this.position.y = y
    return this
  }

  public setAnchor(x: number, y: number): this {
    this.anchor.x = x
    this.anchor.y = y
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', new PositionComponent(this.position.x, this.position.y))
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: createSprite(this.name, this.anchor),
        },
        type: 'UI',
      })
    )
    entity.addComponent('AnimationState', new AnimationStateComponent(entity))
    return entity
  }
}
