import shader from '../../res/shaders/metaball.frag'
import { Filter } from 'pixi.js'
import { World } from '../core/ecs/world'
import { Family, FamilyBuilder } from '../core/ecs/family'

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

  public constructor(world: World, displaySize: { x: number; y: number }) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      points: [],
      effectiveRadius: AirFilter.EFFECTIVE_RADIUS,
    })
    this.uniforms.inAirRate = 0
    this.family = new FamilyBuilder(world).include('Player').build()
  }

  public get airs(): Array<AirDefinition> {
    const airs = []
    for (let i = 0; i < this.uniforms.points.length / 3; i++) {
      airs.push({
        center: {
          x: this.uniforms.points[i * 3],
          y: this.uniforms.points[i * 3 + 1],
        },
        radius: this.uniforms.points[i * 3 + 2],
      })
    }
    return airs
  }

  public set airs(airs: Array<AirDefinition>) {
    this.uniforms.points = []
    airs.map(air => {
      this.uniforms.points.push(air.center.x)
      this.uniforms.points.push(air.center.y)
      this.uniforms.points.push(air.radius)
    })
    this.uniforms.pointNum = airs.length
    if (this.family.entityArray[0].getComponent('AirHolder').inAir) {
      this.uniforms.inAirRate = Math.min(this.uniforms.inAirRate + 0.05, 1)
    } else {
      this.uniforms.inAirRate = Math.max(this.uniforms.inAirRate - 0.05, 0)
    }
    this.family.entityArray[0].getComponent('AirHolder').inAir = false
  }
}
