import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { assert } from '@utils/assertion'
import { Container, ObservablePoint, Sprite, Texture } from 'pixi.js'
import { AnimationDefinition } from './spriteBuffer'

export type AnimationOption = { waitFrames?: number; reverse?: boolean }

class AnimationSpriteFrame extends Sprite {
  private _currentFrame = 0

  public constructor(private textures: Array<Texture>, private waitFrames = 10) {
    super(textures[0])
  }

  public goto(number: number): void {
    assert(
      0 <= number && number < this.length,
      `frame number ${number} is not in range [0, ${this.length})`
    )
    this.texture = this.textures[number]
  }

  public *animate(option: AnimationOption): Behaviour<void> {
    const textures =
      option.reverse === true
        ? this.textures.map((_, idx) => this.textures[this.length - 1 - idx])
        : this.textures
    for (let i = 0; i < textures.length; i++) {
      this.texture = textures[i]
      this._currentFrame = i

      if (option.waitFrames) {
        yield* wait.frame(option.waitFrames)
      } else {
        yield* wait.frame(this.waitFrames)
      }
    }
  }

  public get length(): number {
    return this.textures.length
  }

  public get currentFrame(): number {
    return this._currentFrame
  }
}

export class AnimationSprite extends Container {
  private currentState: string
  private animationSprites: { [key: string]: AnimationSpriteFrame } = {}

  public constructor(
    definitions: { [keys: string]: AnimationDefinition },
    initialState: string,
    anchor = {
      x: 0.5,
      y: 0.5,
    }
  ) {
    super()

    for (const [key, { textures, waitFrames }] of Object.entries(definitions)) {
      const sprite = new AnimationSpriteFrame(textures, waitFrames)
      sprite.visible = false
      sprite.anchor.set(anchor.x, anchor.y)
      this.animationSprites[key] = sprite
      this.addChild(sprite)
    }
    this.currentState = initialState
    this.currentAnimationSprite.visible = true
  }

  public *animate(option: AnimationOption): Behaviour<void> {
    yield* this.currentAnimationSprite.animate(option)
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

  public get currentAnimationSprite(): AnimationSpriteFrame {
    return this.animationSprites[this.currentState]
  }
}
