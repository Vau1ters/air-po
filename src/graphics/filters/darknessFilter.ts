import shader from '../../../res/shaders/darkness.frag'
import { Filter } from 'pixi.js'

export interface LightDefinition {
  center: {
    x: number
    y: number
  }
  intensity: number
}

export class DarknessFilter extends Filter {
  public constructor(
    displaySize: { x: number; y: number },
    setting: { defaultBrightness: number }
  ) {
    super(undefined, shader, {
      displaySize: [displaySize.x, displaySize.y],
      points: [],
      pointNum: 0,
      defaultBrightness: setting.defaultBrightness,
    })
  }

  public set lights(lights: Array<LightDefinition>) {
    this.uniforms.points = []
    for (const light of lights) {
      this.uniforms.points.push(light.center.x)
      this.uniforms.points.push(light.center.y)
      this.uniforms.points.push(light.intensity)
    }
    this.uniforms.pointNum = lights.length
  }
}
