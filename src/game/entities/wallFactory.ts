import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '@game/components/positionComponent'
import { RigidBodyComponent } from '@game/components/rigidBodyComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { ColliderBuilder, ColliderComponent } from '@game/components/colliderComponent'
import { Vec2 } from '@core/math/vec2'
import { CategoryList } from './category'
import { textureStore } from '@core/graphics/art'
import { Sprite } from 'pixi.js'
import { StaticComponent } from '@game/components/staticComponent'

export class WallFactory extends EntityFactory {
  private readonly INV_MASS = 0
  private readonly RESTITUTION = 0

  private readonly AABB = {
    offset: new Vec2(-4, -4),
    size: new Vec2(8, 8),
  }

  public tileId = 0
  public shouldCollide = true

  public create(): Entity {
    const entity = new Entity()

    if (this.shouldCollide) {
      const collider = new ColliderComponent()
      collider.colliders.push(
        new ColliderBuilder()
          .setEntity(entity)
          .setAABB(this.AABB)
          .setCategory(CategoryList.wall)
          .addTag('wall')
          .build()
      )
      entity.addComponent('Collider', collider)

      const body = new RigidBodyComponent(0, new Vec2(), new Vec2(), this.RESTITUTION, 0)
      body.invMass = this.INV_MASS
      entity.addComponent('RigidBody', body)
    }

    const position = new PositionComponent()
    entity.addComponent('Position', position)

    const sprite = new Sprite(textureStore.wall[this.tileId])
    sprite.anchor.set(0.5)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)
    entity.addComponent('Draw', draw)

    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
