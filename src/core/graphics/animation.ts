import { AnimatedSprite, Container, Texture } from 'pixi.js'

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
      sprite.play()
      sprite.animationSpeed = 0.1
      sprite.visible = false
      sprite.anchor.set(0.5)
      this.animatedSprites[key] = sprite
      super.addChild(sprite)
    }
    this.animatedSprites[initialAnimation].visible = true
    this.current = initialAnimation
  }

  public setVisible(isVisible: boolean): void{
    this.animatedSprites[this.current].visible = isVisible
  }

  public changeTo(animation: string): void {
    if (animation != this.current) {
      this.animatedSprites[this.current].visible = false
      this.animatedSprites[animation].visible = true
      this.current = animation
    }
  }
}
