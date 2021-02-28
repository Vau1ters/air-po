import { AnimationSprite } from '@core/graphics/animation'

export class VineComponent {
  public sprites: Array<AnimationSprite> = []
  public canExtend = false
  public shouldShrink = false
  public constructor(public length: number) {}
}
