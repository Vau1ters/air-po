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
  }
}
