import { BaseTexture, Rectangle, Texture } from 'pixi.js'

import titleImg from '../../res/title.png'

import playerImg from '../../res/player.png'
import playerSetting from '../../res/player.json'

import wallImg from '../../res/wall.png'
import wallSetting from '../../res/wall.json'

import enemy1Img from '../../res/enemy1.png'
import enemy1Setting from '../../res/enemy1.json'

import vineImg from '../../res/vine.png'
import vineSetting from '../../res/vine.json'

import snibeeImg from '../../res/snibee.png'
import snibeeSetting from '../../res/snibee.json'

import ballBulletImg from '../../res/ballBullet.png'
import ballBulletSetting from '../../res/ballBullet.json'

import needleBulletImg from '../../res/needleBullet.png'
import needleBulletSetting from '../../res/needleBullet.json'

import balloonvineImg from '../../res/balloonvine.png'
import balloonvineSetting from '../../res/balloonvine.json'

import mossImg from '../../res/moss.png'
import mossSetting from '../../res/moss.json'

import dandelionHeadImg from '../../res/dandelion_head.png'
import dandelionFluffImg from '../../res/dandelion_fluff.png'

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
  textureStore.title = await buildSingleTexture(titleImg)
  textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  textureStore.wall = await buildAnimationTexture(wallImg, wallSetting)
  textureStore.enemy1 = await buildAnimationTexture(enemy1Img, enemy1Setting)
  textureStore.vine = await buildAnimationTexture(vineImg, vineSetting)
  textureStore.snibee = await buildAnimationTexture(snibeeImg, snibeeSetting)
  textureStore.ballBullet = await buildAnimationTexture(ballBulletImg, ballBulletSetting)
  textureStore.needleBullet = await buildAnimationTexture(needleBulletImg, needleBulletSetting)
  textureStore.balloonvine = await buildAnimationTexture(balloonvineImg, balloonvineSetting)
  textureStore.moss = await buildAnimationTexture(mossImg, mossSetting)
  textureStore.dandelionHead = await buildSingleTexture(dandelionHeadImg)
  textureStore.dandelionFluff = await buildSingleTexture(dandelionFluffImg)
}