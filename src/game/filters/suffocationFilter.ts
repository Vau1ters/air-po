import shader from '@res/shaders/suffocation.frag'
import { Filter } from 'pixi.js'

export class SuffocationFilter extends Filter {
  public constructor(displaySize: { x: number; y: number }) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      time: 0,
      suffocationRate: 0,
    })
  }

  public updateUniforms(suffocationRate: number): void {
    this.uniforms.time++
    this.uniforms.suffocationRate = suffocationRate
  }
}
