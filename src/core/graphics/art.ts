import { BaseTexture, Rectangle, Texture } from 'pixi.js'
import playerImg from '../../../res/player.png'
import wallImg from '../../../res/wall.png'
import enemy1Img from '../../../res/enemy1.png'

function loadTexture(url: string): Promise<BaseTexture> {
  return new Promise((resolve, reject) => {
    const texture = BaseTexture.from(url)
    if (texture.width > 0) resolve(texture)
    texture.on('loaded', (tex: BaseTexture) => {
      resolve(tex)
    })
    texture.on('error', (_tex: BaseTexture, event: ErrorEvent) => {
      reject(event)
    })
  })
}

export const textureStore: { [key: string]: Array<Texture> } = {}
export const wallBaseTextures = new Array<Texture>()
export const init = async (): Promise<void> => {
  const playerBase = await loadTexture(playerImg)
  textureStore.player = new Array<Texture>()
  for (let x = 0; x < playerBase.width / 16; x++) {
    const texture = new Texture(playerBase, new Rectangle(x * 16, 0, 16, 16))
    textureStore.player.push(texture)
  }

  const wallBase = await loadTexture(wallImg)
  for (let y = 0; y < wallBase.height / 8; y++) {
    for (let x = 0; x < wallBase.width / 8; x++) {
      const texture = new Texture(wallBase, new Rectangle(x * 8, y * 8, 8, 8))
      wallBaseTextures.push(texture)
    }
  }
  textureStore.wallBase = wallBaseTextures

  const enemy1Base = await loadTexture(enemy1Img)
  textureStore.enemy1 = new Array<Texture>()
  for (let x = 0; x < enemy1Base.width / 16; x++) {
    const texture = new Texture(enemy1Base, new Rectangle(x * 16, 0, 16, 16))
    textureStore.enemy1.push(texture)
  }
}
