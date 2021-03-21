import { Container, DisplayObject } from 'pixi.js'
import { Entity } from '@core/ecs/entity'
import { Category } from '../entities/category'
import { Vec2 } from '@core/math/vec2'
import { buildCollider, Collider } from './colliderComponent'
import { AnimationSprite } from '@core/graphics/animation'

export type ContainerType = 'World' | 'WorldUI' | 'UI'

type DrawComponentOption = {
  entity: Entity
  type?: ContainerType
  child?: { sprite: DisplayObject; zIndex?: number; state?: string }
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
        option.child.sprite.zIndex = option.child.zIndex
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
    const shouldDrawAnyway = this.type === 'UI'
    const VERY_BIG_NUMBER = 1000_000_007
    return buildCollider({
      entity: this.entity,
      geometry: {
        type: 'AABB',
        offset: shouldDrawAnyway
          ? new Vec2()
          : new Vec2(localBounds.x + localBounds.width / 2, localBounds.y + localBounds.height / 2),
        size: shouldDrawAnyway
          ? new Vec2(VERY_BIG_NUMBER, VERY_BIG_NUMBER)
          : new Vec2(localBounds.width, localBounds.height),
      },
      category: Category.DRAW,
    })
  }
}
