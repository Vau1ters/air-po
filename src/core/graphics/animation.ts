import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Container, ObservablePoint, Sprite, Texture } from 'pixi.js'

class AnimationSpriteFrame extends Sprite {
  public constructor(private textures: Array<Texture>, private waitFrames = 10) {
    super(textures[0])
  }

  public goto(number: number): void {
    this.texture = this.textures[number]
  }

  public *animate(waitFrames?: number): Behaviour<void> {
    for (const texture of this.textures) {
      this.texture = texture
      if (waitFrames) {
        yield* wait(waitFrames)
      } else {
        yield* wait(this.waitFrames)
      }
    }
  }
}

export type AnimationDefinition = {
  [key: string]: {
    textures: Array<Texture>
    waitFrames: number
  }
}

export class AnimationSprite extends Container {
  private currentState: string
  private animationSprites: { [key: string]: AnimationSpriteFrame } = {}

  public constructor(
    definition: AnimationDefinition,
    initialState: string,
    anchor = {
      x: 0.5,
      y: 0.5,
    }
  ) {
    super()

    for (const [key, { textures, waitFrames }] of Object.entries(definition)) {
      const sprite = new AnimationSpriteFrame(textures, waitFrames)
      sprite.visible = false
      sprite.anchor.set(anchor.x, anchor.y)
      this.animationSprites[key] = sprite
      this.addChild(sprite)
    }
    this.currentState = initialState
    this.currentAnimationSprite.visible = true
  }

  public *animate(waitFrame?: number): Behaviour<void> {
    yield* this.currentAnimationSprite.animate(waitFrame)
  }

  public set isVisible(isVisible: boolean) {
    this.currentAnimationSprite.visible = isVisible
  }

  public get isVisible(): boolean {
    return this.currentAnimationSprite.visible
  }

  public set state(nextState: string) {
    if (nextState === this.currentState) return

    this.currentAnimationSprite.visible = false

    this.currentState = nextState
    this.currentAnimationSprite.visible = true
    this.currentAnimationSprite.goto(0)
  }

  public get state(): string {
    return this.currentState
  }

  public get anchor(): ObservablePoint {
    return this.currentAnimationSprite.anchor
  }

  private get currentAnimationSprite(): AnimationSpriteFrame {
    return this.animationSprites[this.currentState]
  }
}
