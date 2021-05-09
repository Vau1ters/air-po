import shader from '@res/shaders/deathEffect.frag'
import { Filter } from 'pixi.js'
import { World } from '@core/ecs/world'

export class DeathEffectFilter extends Filter {
  public constructor(world: World, displaySize: { x: number; y: number }) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      frame: 0,
    })
  }

  public update(): void {
    this.uniforms.frame++
  }
}
