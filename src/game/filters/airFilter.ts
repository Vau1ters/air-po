import shader from '../../res/shaders/air.frag'
import { Filter } from 'pixi.js'
import { World } from '../core/ecs/world'
import { Family, FamilyBuilder } from '../core/ecs/family'
import { Vec2 } from '../core/math/vec2'

export interface AirDefinition {
  center: {
    x: number
    y: number
  }
  radius: number
}

export class AirFilter extends Filter {
  public static readonly EFFECTIVE_RADIUS = 200

  private family: Family

  public constructor(
    world: World,
    displaySize: { x: number; y: number },
    setting: { antiAlias: boolean }
  ) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      points: [],
      pointNum: 0,
      camera: [0, 0],
      effectiveRadius: AirFilter.EFFECTIVE_RADIUS,
      antiAlias: setting.antiAlias,
      inAirRate: 0,
    })
    this.family = new FamilyBuilder(world).include('Player').build()
  }

  public updateUniforms(airs: Array<AirDefinition>, camera: Vec2): void {
    this.uniforms.points = []
    for (const air of airs) {
      this.uniforms.points.push(air.center.x)
      this.uniforms.points.push(air.center.y)
      this.uniforms.points.push(air.radius)
    }
    this.uniforms.pointNum = airs.length
    if (this.family.entityArray[0].getComponent('AirHolder').inAir) {
      this.uniforms.inAirRate = Math.min(this.uniforms.inAirRate + 0.05, 1)
    } else {
      this.uniforms.inAirRate = Math.max(this.uniforms.inAirRate - 0.05, 0)
    }
    this.family.entityArray[0].getComponent('AirHolder').inAir = false
    this.uniforms.camera = [camera.x, camera.y]
  }
}
