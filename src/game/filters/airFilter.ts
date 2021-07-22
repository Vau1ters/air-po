import shader from '@res/shaders/air.frag'
import { Filter } from 'pixi.js'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { Air } from '@core/collision/geometry/air'
import { getSingleton } from '@game/systems/singletonSystem'

export interface AirDefinition {
  center: {
    x: number
    y: number
  }
  radius: number
}

export class AirFilter extends Filter {
  public constructor(
    private world: World,
    displaySize: { x: number; y: number },
    setting: { antiAlias: boolean }
  ) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      points: [],
      pointNum: 0,
      camera: [0, 0],
      effectiveRadius: Air.EFFECTIVE_RADIUS,
      antiAlias: setting.antiAlias,
      inAirRate: 0,
    })
  }

  public updateUniforms(airs: Array<AirDefinition>, camera: Vec2): void {
    this.uniforms.points = []
    for (const air of airs) {
      this.uniforms.points.push(air.center.x)
      this.uniforms.points.push(air.center.y)
      this.uniforms.points.push(air.radius)
    }
    this.uniforms.pointNum = airs.length

    const player = getSingleton('Player', this.world)
    const airHolder = player.getComponent('AirHolder')
    if (airHolder.inAir) {
      this.uniforms.inAirRate = Math.min(this.uniforms.inAirRate + 0.05, 1)
    } else {
      this.uniforms.inAirRate = Math.max(this.uniforms.inAirRate - 0.05, 0)
    }
    airHolder.inAir = false
    this.uniforms.camera = [Math.ceil(camera.x), Math.ceil(camera.y)]
  }
}
