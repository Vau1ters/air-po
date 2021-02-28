import { Container, DisplayObject } from 'pixi.js'
import { Entity } from '@core/ecs/entity'
import { Category, CategorySet } from '../entities/category'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, Collider } from './colliderComponent'
import { AnimationSprite } from '@core/graphics/animation'

export type ContainerType = 'World' | 'WorldUI'

type DrawComponentOption = {
  entity: Entity
  type?: ContainerType
  child?: { sprite: DisplayObject; zIndex?: number; state?: string }
  zIndex?: number
}

export class DrawComponent extends Container {
  private entity: Entity
  public readonly type: ContainerType

  constructor(option: DrawComponentOption) {
    super()
    this.entity = option.entity
    this.type = option.type ?? 'World'
    if (option.child) {
      this.addChild(option.child.sprite)
      if (option.child.zIndex) {
        option.child.zIndex = option.zIndex
        this.sortableChildren = true
      }
      if (option.child.state) {
        const sprite = option.child.sprite as AnimationSprite
        sprite.changeTo(option.child.state)
      }
    }
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
