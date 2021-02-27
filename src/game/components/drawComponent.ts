import { Container } from 'pixi.js'
import { Entity } from '@core/ecs/entity'
import { Category, CategorySet } from '../entities/category'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, Collider } from './colliderComponent'

export type ContainerType = 'World' | 'WorldUI'

export class DrawComponent extends Container {
  /* to be used for specifying position */
  constructor(private entity: Entity, public readonly type: ContainerType = 'World') {
    super()
    this.visible = false
  }

  createCollider(): Collider {
    const localBounds = this.getLocalBounds()
    return buildCollider({
      entity: this.entity,
      geometry: {
        type: 'AABB',
        offset: new Vec2(localBounds.x, localBounds.y),
        size: new Vec2(localBounds.width, localBounds.height),
      },
      isSensor: true,
      category: Category.DRAW,
      mask: new CategorySet(Category.SENSOR),
    })
  }
}
