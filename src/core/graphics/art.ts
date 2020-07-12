import { BaseTexture, Rectangle, Texture } from 'pixi.js'

import playerImg from '../../../res/player.png'
import playerSetting from '../../../res/player.json'

import wallImg from '../../../res/wall.png'
import wallSetting from '../../../res/wall.json'

import enemy1Img from '../../../res/enemy1.png'
import enemy1Setting from '../../../res/enemy1.json'

import balloonvineImg from '../../../res/balloonvine.png'
import balloonvineSetting from '../../../res/balloonvine.json'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildAnimationTexture(baseURL: string, setting: any): Promise<Array<Texture>> {
  const base = await loadTexture(baseURL)
  const result = new Array<Texture>()
  const w = setting.tilewidth
  const h = setting.tileheight
  for (let y = 0; y < base.height / h; y++) {
    for (let x = 0; x < base.width / w; x++) {
      const texture = new Texture(base, new Rectangle(x * w, y * h, w, h))
      result.push(texture)
    }
  }
  return result
}

export const textureStore: { [key: string]: Array<Texture> } = {}
export const init = async (): Promise<void> => {
  textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  textureStore.wall = await buildAnimationTexture(wallImg, wallSetting)
  textureStore.enemy1 = await buildAnimationTexture(enemy1Img, enemy1Setting)
  textureStore.balloonvine = await buildAnimationTexture(balloonvineImg, balloonvineSetting)
}
