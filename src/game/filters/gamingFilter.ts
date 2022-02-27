import shader from '@res/shaders/gaming.frag'
import { Filter } from 'pixi.js'

export class GamingFilter extends Filter {
  public constructor() {
    super(undefined, shader, {
      srcColor: [1, 0, 0],
      dstColor: [0, 0, 0],
    })
  }

  public set dstColor(dstColor: [number, number, number]) {
    this.uniforms.dstColor = dstColor
  }
}
