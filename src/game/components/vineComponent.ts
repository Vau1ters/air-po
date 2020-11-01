import { Animation } from '../graphics/animation'

export class VineComponent {
  public sprites: Array<Animation> = []
  public canExtend = false
  public shouldShrink = false
  public constructor(public length: number) {}
}
