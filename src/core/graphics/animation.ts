import { AnimatedSprite, Container, ObservablePoint, Texture } from 'pixi.js'

export class Animation extends Container {
  private current: string
  private animatedSprites: { [key: string]: AnimatedSprite } = {}
  public constructor(
    animatedTextures: { [key: string]: Array<Texture> },
    initialAnimation: string
  ) {
    super()
    for (const [key, textures] of Object.entries(animatedTextures)) {
      const sprite = new AnimatedSprite(textures)
      sprite.animationSpeed = 0.1
      sprite.visible = false
      sprite.anchor.set(0.5)
      sprite.loop = false
      this.animatedSprites[key] = sprite
      super.addChild(sprite)
    }
    this.animatedSprites[initialAnimation].visible = true
    this.animatedSprites[initialAnimation].play()
    this.current = initialAnimation
  }

  public setVisible(isVisible: boolean): void {
    this.animatedSprites[this.current].visible = isVisible
  }

  public changeTo(animation: string): void {
    this.animatedSprites[this.current].visible = false
    this.animatedSprites[this.current].stop()
    this.animatedSprites[animation].visible = true
    this.animatedSprites[animation].gotoAndPlay(0)
    this.current = animation
  }

  public get anchor(): ObservablePoint {
    return this.animatedSprites[this.current].anchor
  }

  public get playing(): boolean {
    return this.animatedSprites[this.current].playing
  }

  public set loop(loop: boolean) {
    for (const sprite of Object.values(this.animatedSprites)) {
      sprite.loop = loop
    }
  }
}
