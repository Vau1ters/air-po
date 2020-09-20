import shader from '../../res/shaders/darkness.frag'
import { Filter } from 'pixi.js'

export class DarknessFilter extends Filter {
  public constructor() {
    super(undefined, shader, {})
  }
}
