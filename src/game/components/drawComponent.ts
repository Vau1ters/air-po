import { Container, Sprite } from 'pixi.js'
import { Animation } from '../../core/graphics/animation'
import { Entity } from '../../core/ecs/entity'
import { Category, CategorySet } from '../entities/category'
import { AABB } from '../../core/collision/aabb'
import { Vec2 } from '../../core/math/vec2'
import { AABBCollider, Collider } from './colliderComponent'

export class DrawComponent extends Container {
  /* to be used for specifying position */
  private entity: Entity
  private child: Sprite | Animation

  constructor(entity: Entity, child: Sprite | Animation) {
    super()
    this.entity = entity
    this.child = child
    this.visible = false

    this.addChild(child)
  }

  createCollider(): Collider {
    return new AABBCollider(
      this.entity,
      new AABB(
        new Vec2(-this.child.width * this.child.anchor.x, -this.child.height * this.child.anchor.y),
        new Vec2(this.child.width, this.child.height)
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
