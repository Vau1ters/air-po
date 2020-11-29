import wallSetting from '@res/map/wall.json'
import vineSetting from '@res/map/vine.json'
import teststage2Setting from '@res/map/teststage2.json'
import teststageSetting from '@res/map/teststage.json'
import snibeeSetting from '@res/map/snibee.json'
import sensorSetting from '@res/map/sensor.json'
import playerSetting from '@res/map/player.json'
import needleBulletSetting from '@res/map/needleBullet.json'
import mossSetting from '@res/map/moss.json'
import enemy1Setting from '@res/map/enemy1.json'
import dandelionSetting from '@res/map/dandelion.json'
import balloonvineSetting from '@res/map/balloonvine.json'
import ballBulletSetting from '@res/map/ballBullet.json'
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
  textureStore.ballBullet = await buildAnimationTexture(ballBulletImg, ballBulletSetting)
  textureStore.balloonvine = await buildAnimationTexture(balloonvineImg, balloonvineSetting)
  textureStore.dandelion = await buildAnimationTexture(dandelionImg, dandelionSetting)
  textureStore.dandelion_fluff = await buildSingleTexture(dandelion_fluffImg)
  textureStore.dandelion_head = await buildSingleTexture(dandelion_headImg)
  textureStore.enemy1 = await buildAnimationTexture(enemy1Img, enemy1Setting)
  textureStore.moss = await buildAnimationTexture(mossImg, mossSetting)
  textureStore.needleBullet = await buildAnimationTexture(needleBulletImg, needleBulletSetting)
  textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  textureStore.sensor = await buildAnimationTexture(sensorImg, sensorSetting)
  textureStore.snibee = await buildAnimationTexture(snibeeImg, snibeeSetting)
  textureStore.title = await buildSingleTexture(titleImg)
  textureStore.vine = await buildAnimationTexture(vineImg, vineSetting)
  textureStore.wall = await buildAnimationTexture(wallImg, wallSetting)
}
