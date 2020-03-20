import shader from '../../res/shaders/metaball.frag'
import { Filter } from 'pixi.js'

export interface AirDefinition {
  center: {
    x: number
    y: number
  }
  radius: number
}

export class AirFilter extends Filter {
  public constructor(displaySize: { x: number; y: number }) {
    super(undefined, shader, {
      time: 0.0,
      displaySize: [displaySize.x, displaySize.y],
      points: [],
    })
  }

  public addAir(...airs: AirDefinition[]): void {
    airs.forEach(air => {
      this.uniforms.points.push(air.center.x)
      this.uniforms.points.push(air.center.y)
      this.uniforms.points.push(air.radius)
    })
  }
}
