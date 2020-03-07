import { BaseTexture, Rectangle, Texture } from 'pixi.js'
import playerImg from '../../../res/player.png'
import wallImg from '../../../res/wall.png'

export class Art {
  public static player = new Array<Texture>()
  public static wall = new Array<Texture>()

  public static init(): void {
    const playerBase = BaseTexture.from(playerImg)
    for (let x = 0; x < playerBase.width / 16; x++) {
      const texture = new Texture(playerBase, new Rectangle(x * 16, 0, 16, 16))
      Art.player.push(texture)
    }

    const wallBase = BaseTexture.from(wallImg)
    for (let y = 0; y < wallBase.height / 8; y++) {
      for (let x = 0; x < wallBase.width / 8; x++) {
        const texture = new Texture(wallBase, new Rectangle(x * 8, y * 8, 8, 8))
        Art.wall.push(texture)
      }
    }
  }
}
