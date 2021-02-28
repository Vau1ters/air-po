import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import { textureStore } from '@core/graphics/art'
import { Sprite } from 'pixi.js'
import { StaticComponent } from '@game/components/staticComponent'

export class WallFactory extends EntityFactory {
  private readonly COLLIDER = {
    type: 'AABB' as const,
    offset: new Vec2(-4, -4),
    size: new Vec2(8, 8),
  }

  public tileId = 0
  public shouldCollide = true

  public create(): Entity {
    const entity = new Entity()

    if (this.shouldCollide) {
      entity.addComponent(
        'Collider',
        new ColliderComponent(
          buildCollider({
            entity,
            geometry: this.COLLIDER,
            category: Category.STATIC_WALL,
            mask: new CategorySet(Category.SENSOR, Category.PHYSICS),
            tag: ['wall'],
          })
        )
      )
      entity.addComponent('RigidBody', new RigidBodyComponent())
    }

    const sprite = new Sprite(textureStore.wall[this.tileId])
    sprite.anchor.set(0.5)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)

    entity.addComponent('Draw', draw)
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
