import { Container } from 'pixi.js'
import { Entity } from '../ecs/entity'
import { Category, CategorySet } from '../entities/category'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { AABBCollider, Collider } from './colliderComponent'

export class DrawComponent extends Container {
  /* to be used for specifying position */
  private entity: Entity

  constructor(entity: Entity) {
    super()
    this.entity = entity
    this.visible = false
  }

  createCollider(): Collider {
    const localBounds = this.getLocalBounds()
    return new AABBCollider(
      this.entity,
      new AABB(
        new Vec2(localBounds.x, localBounds.y),
        new Vec2(localBounds.width, localBounds.height)
      ),
      new Vec2(),
      true,
      new Set(),
      new Set<string>(),
      Category.DRAW,
      new CategorySet(Category.SENSOR)
    )
  }
}
