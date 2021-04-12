import { Entity } from '@core/ecs/entity'
import { textureStore } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent, buildCollider } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { PHYSICS_TAG } from '@game/systems/physicsSystem'
import { Sprite } from 'pixi.js'
import { Category, CategorySet } from '../category'
import { EntityFactory } from '../entityFactory'

export class WallFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    size: new Vec2(8, 8),
  }

  public tileId = 0
  public shouldCollide = true

  constructor(private pos: Vec2) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    if (this.shouldCollide) {
      entity.addComponent(
        'Collider',
        new ColliderComponent(
          buildCollider({
            entity,
            geometry: this.COLLIDER,
            category: Category.TERRAIN,
            mask: new CategorySet(Category.PHYSICS),
            tag: [PHYSICS_TAG],
          })
        )
      )
      entity.addComponent('RigidBody', new RigidBodyComponent())
    }

    const sprite = new Sprite(textureStore.wall[this.tileId])
    sprite.anchor.set(0.5)

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite,
        },
      })
    )
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
