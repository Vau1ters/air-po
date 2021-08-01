import { Texture } from 'pixi.js'
import { AnimationSprite } from './animationSprite'

export type AnimationDefinition = {
  textures: Array<Texture>
  waitFrames: number
}

export class SpriteBuffer {
  constructor(
    public definitions: { [keys: string]: AnimationDefinition },
    private defaultState: string
  ) {}

  createAnimationSprite(anchor = { x: 0.5, y: 0.5 }): AnimationSprite {
    return new AnimationSprite(this.definitions, this.defaultState, anchor)
  }
}
