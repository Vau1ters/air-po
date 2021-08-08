import { Entity } from '@core/ecs/entity'
import { createSprite } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { EntityFactory } from './entityFactory'

export class PoisonFactory extends EntityFactory {
  public position: Vec2 = new Vec2()

  public setPosition(position: Vec2): this {
    this.position = position
    return this
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Position', this.position)
    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: createSprite('poison'),
        },
      })
    )
    entity.addComponent('RigidBody', new RigidBodyComponent())

    return entity
  }
}
