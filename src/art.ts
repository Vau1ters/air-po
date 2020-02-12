import * as PIXI from 'pixi.js'

export default class Art {
  public static createRect(color: number): PIXI.Graphics {
    const sprite = new PIXI.Graphics()
    sprite.beginFill(color)
    sprite.drawRect(0, 0, 32, 32)
    sprite.endFill()
    return sprite
  }
}
