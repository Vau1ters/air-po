// IMPORT
import wallSetting from '@res/map/tileset/wall.json'
import vineSetting from '@res/map/tileset/vine.json'
import throughFloorSetting from '@res/map/tileset/throughFloor.json'
import snibeeSetting from '@res/map/tileset/snibee.json'
import slime1Setting from '@res/map/tileset/slime1.json'
import sensorSetting from '@res/map/tileset/sensor.json'
import risuponSetting from '@res/map/tileset/risupon.json'
import playerSetting from '@res/map/tileset/player.json'
import needleBulletSetting from '@res/map/tileset/needleBullet.json'
import mushroomSetting from '@res/map/tileset/mushroom.json'
import mossSetting from '@res/map/tileset/moss.json'
import equipmentSetting from '@res/map/tileset/equipment.json'
import enemy1Setting from '@res/map/tileset/enemy1.json'
import dandelionSetting from '@res/map/tileset/dandelion.json'
import balloonvineSetting from '@res/map/tileset/balloonvine.json'
import ballBulletSetting from '@res/map/tileset/ballBullet.json'
import airGeyserSetting from '@res/map/tileset/airGeyser.json'
import wallImg from '@res/image/wall.png'
import vineImg from '@res/image/vine.png'
import titleImg from '@res/image/title.png'
import throughFloorImg from '@res/image/throughFloor.png'
import snibeeImg from '@res/image/snibee.png'
import slime1Img from '@res/image/slime1.png'
import sensorImg from '@res/image/sensor.png'
import risuponImg from '@res/image/risupon.png'
import playerImg from '@res/image/player.png'
import needleBulletImg from '@res/image/needleBullet.png'
import mushroomImg from '@res/image/mushroom.png'
import mossImg from '@res/image/moss.png'
import jetEffectImg from '@res/image/jetEffect.png'
import equipmentImg from '@res/image/equipment.png'
import enemy1Img from '@res/image/enemy1.png'
import dandelionHeadImg from '@res/image/dandelion_head.png'
import dandelionFluffImg from '@res/image/dandelion_fluff.png'
import dandelionImg from '@res/image/dandelion.png'
import balloonvineImg from '@res/image/balloonvine.png'
import ballBulletImg from '@res/image/ballBullet.png'
import airGeyserImg from '@res/image/airGeyser.png'
/*+.† NOTIFICATION †.+*/
// this file is automatically written by arttool.
// you can update this file by type "yarn arttool" command.

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
  // LOAD_RESOURCE
  textureStore.wall = await buildAnimationTexture(wallImg, wallSetting)
  textureStore.vine = await buildAnimationTexture(vineImg, vineSetting)
  textureStore.title = await buildSingleTexture(titleImg)
  textureStore.throughFloor = await buildAnimationTexture(throughFloorImg, throughFloorSetting)
  textureStore.snibee = await buildAnimationTexture(snibeeImg, snibeeSetting)
  textureStore.slime1 = await buildAnimationTexture(slime1Img, slime1Setting)
  textureStore.sensor = await buildAnimationTexture(sensorImg, sensorSetting)
  textureStore.risupon = await buildAnimationTexture(risuponImg, risuponSetting)
  textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  textureStore.needleBullet = await buildAnimationTexture(needleBulletImg, needleBulletSetting)
  textureStore.mushroom = await buildAnimationTexture(mushroomImg, mushroomSetting)
  textureStore.moss = await buildAnimationTexture(mossImg, mossSetting)
  textureStore.jetEffect = await buildSingleTexture(jetEffectImg)
  textureStore.equipment = await buildAnimationTexture(equipmentImg, equipmentSetting)
  textureStore.enemy1 = await buildAnimationTexture(enemy1Img, enemy1Setting)
  textureStore.dandelionHead = await buildSingleTexture(dandelionHeadImg)
  textureStore.dandelionFluff = await buildSingleTexture(dandelionFluffImg)
  textureStore.dandelion = await buildAnimationTexture(dandelionImg, dandelionSetting)
  textureStore.balloonvine = await buildAnimationTexture(balloonvineImg, balloonvineSetting)
  textureStore.ballBullet = await buildAnimationTexture(ballBulletImg, ballBulletSetting)
  textureStore.airGeyser = await buildAnimationTexture(airGeyserImg, airGeyserSetting)
}
