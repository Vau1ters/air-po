import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Container, ObservablePoint, Sprite, Texture } from 'pixi.js'

class AnimationSprite extends Sprite {
  public constructor(private textures: Array<Texture>, private waitFrames = 10) {
    super(textures[0])
  }

  public goto(number: number): void {
    this.texture = this.textures[number]
  }

  public *animate(): Behaviour<void> {
    for (const texture of this.textures) {
      this.texture = texture
      yield* wait(this.waitFrames)
    }
  }
}

export type AnimationDefinition = {
  [key: string]: {
    textures: Array<Texture>
    waitFrames: number
  }
}

export class Animation extends Container {
  private currentState: string
  private animationSprites: { [key: string]: AnimationSprite } = {}

  public constructor(definition: AnimationDefinition, initialState: string) {
    super()

    for (const [key, { textures, waitFrames }] of Object.entries(definition)) {
      const sprite = new AnimationSprite(textures, waitFrames)
      sprite.visible = false
      sprite.anchor.set(0.5)
      this.animationSprites[key] = sprite
      this.addChild(sprite)
    }
    this.currentState = initialState
    this.currentAnimationSprite.visible = true
  }

  public *animate(): Behaviour<void> {
    yield* this.currentAnimationSprite.animate()
  }

  public setVisible(isVisible: boolean): void {
    this.currentAnimationSprite.visible = isVisible
  }

  public changeTo(nextState: string): void {
    if (nextState === this.currentState) return

    this.currentAnimationSprite.visible = false

    this.currentState = nextState
    this.currentAnimationSprite.visible = true
    this.currentAnimationSprite.goto(0)
  }

  public get anchor(): ObservablePoint {
    return this.currentAnimationSprite.anchor
  }

  private get currentAnimationSprite(): AnimationSprite {
    return this.animationSprites[this.currentState]
  }
}
