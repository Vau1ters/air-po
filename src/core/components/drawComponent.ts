import { Container, Sprite } from 'pixi.js'
import { Animation } from '../../core/graphics/animation'

export class DrawComponent extends Container {
  readonly size: number[]
  readonly center: number[]

  constructor(child: Sprite | Animation) {
    super()
    this.addChild(child)
    this.size = [child.width, child.height]
    this.center = [child.anchor.x, child.anchor.y]
  }
}
