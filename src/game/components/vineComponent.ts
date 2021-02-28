import { Entity } from '@core/ecs/entity'
import { AnimationSprite } from '@core/graphics/animation'

export class VineComponent {
  public sprites: Array<AnimationSprite> = []
  public canExtend = false
  public shouldShrink = false
  public constructor(entity: Entity, public length: number) {
    const [sprite] = entity.getComponent('Draw').children as [AnimationSprite]
    this.sprites.push(sprite)
  }
}
