import wallImg from '@res/image/wall.png'
import vineImg from '@res/image/vine.png'
import titleImg from '@res/image/title.png'
import snibeeImg from '@res/image/snibee.png'
import sensorImg from '@res/image/sensor.png'
import playerImg from '@res/image/player.png'
import needleBulletImg from '@res/image/needleBullet.png'
import mossImg from '@res/image/moss.png'
import enemy1Img from '@res/image/enemy1.png'
import dandelion_headImg from '@res/image/dandelion_head.png'
import dandelion_fluffImg from '@res/image/dandelion_fluff.png'
import dandelionImg from '@res/image/dandelion.png'
import balloonvineImg from '@res/image/balloonvine.png'
import ballBulletImg from '@res/image/ballBullet.png'
import { BaseTexture, Rectangle, Texture } from 'pixi.js'












type Setting = {
  columns: number
  image: string
  imageheight: number
  imagewidth: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tiledversion: string
  tileheight: number
  tilewidth: number
  type: string
  version: number
}

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

async function buildAnimationTexture(baseURL: string, setting: Setting): Promise<Array<Texture>> {
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

async function buildSingleTexture(baseURL: string): Promise<Array<Texture>> {
  const base = await loadTexture(baseURL)
  const result = new Array<Texture>()
  result.push(new Texture(base))
  return result
}

export const textureStore: { [key: string]: Array<Texture> } = {}
export const init = async (): Promise<void> => {

textureStore.ballBullet= await buildAnimationTexture(ballBulletImg, ballBulletSetting)
textureStore.balloonvine= await buildSingleTexture(balloonvineImg)
textureStore.dandelion= await buildSingleTexture(dandelionImg)
textureStore.dandelion_fluff= await buildSingleTexture(dandelion_fluffImg)
textureStore.dandelion_head= await buildSingleTexture(dandelion_headImg)
textureStore.enemy1= await buildSingleTexture(enemy1Img)
textureStore.moss= await buildSingleTexture(mossImg)
textureStore.needleBullet= await buildSingleTexture(needleBulletImg)
textureStore.player= await buildSingleTexture(playerImg)
textureStore.sensor= await buildSingleTexture(sensorImg)
textureStore.snibee= await buildSingleTexture(snibeeImg)
textureStore.title= await buildSingleTexture(titleImg)
textureStore.vine= await buildSingleTexture(vineImg)
textureStore.wall= await buildSingleTexture(wallImg)
}