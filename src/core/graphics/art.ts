import { assert } from '@utils/assertion'
import { BaseTexture, Texture, Rectangle } from 'pixi.js'
import { AnimationSprite } from './animationSprite'
import { SpriteBuffer, AnimationDefinition } from './spriteBuffer'
import { spriteURL } from './spriteURL'
import * as t from 'io-ts'

export const SpriteNameType = t.keyof(spriteURL)
export type SpriteName = t.TypeOf<typeof SpriteNameType>

export const toSpriteName = (s: string): SpriteName => {
  assert(s in spriteURL, `'${s} is not SpriteName`)
  return s as SpriteName
}

type Setting = {
  name: string
  path: string
  texture?: {
    size?: {
      width: number
      height: number
    }
  }
  animation?: {
    state: { [key: string]: Array<number> }
    speed?: { [key: string]: number }
    default: string
  }
}

// 一枚絵をアニメーションとして扱うための設定
const DEFAULT_ANIMATION_SETTING = {
  state: { Default: [-1] },
  speed: {},
  default: 'Default',
}

const spriteStore: { [key: string]: SpriteBuffer } = {}

const loadTexture = async (path: string): Promise<BaseTexture> => {
  return new Promise((resolve, reject) => {
    const name = path.split('.')[0]
    const { default: url } = require(`/res/image/${name}.png`) // eslint-disable-line  @typescript-eslint/no-var-requires
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

const loadMultiTexture = async (setting: Setting): Promise<Array<Texture>> => {
  const base = await loadTexture(setting.path)
  const result = new Array<Texture>()
  const w = setting.texture?.size?.width ?? base.width
  const h = setting.texture?.size?.height ?? base.height
  for (let y = 0; y < base.height / h; y++) {
    for (let x = 0; x < base.width / w; x++) {
      const texture = new Texture(base, new Rectangle(x * w, y * h, w, h))
      result.push(texture)
    }
  }
  return result
}

const loadSpriteBuffer = async (setting: Setting): Promise<SpriteBuffer> => {
  const textures = await loadMultiTexture(setting)
  const animationSetting = setting.animation ?? DEFAULT_ANIMATION_SETTING

  const state: { [key: string]: number[] } = animationSetting.state
  const speed: { [key: string]: number } = animationSetting.speed ?? {}

  const defaultState = animationSetting.default
  assert(state[defaultState], `"${defaultState}" is not contained in state`)

  const definitions: { [keys: string]: AnimationDefinition } = {}
  for (const stateName of Object.keys(state)) {
    const indices = state[stateName]
    definitions[stateName] = {
      textures: indices[0] === -1 ? textures : indices.map(i => textures[i]),
      waitFrames: speed[stateName],
    }
  }
  return new SpriteBuffer(definitions, defaultState)
}

export const init = async (): Promise<void> => {
  for (const name of Object.keys(spriteURL) as Array<SpriteName>) {
    spriteStore[name] = await loadSpriteBuffer(spriteURL[name])
  }
}

export const getSpriteBuffer = (name: SpriteName): SpriteBuffer => {
  const buffer = spriteStore[name]
  assert(buffer !== undefined, name + ' is not loaded')
  return buffer
}

export const createSprite = (name: SpriteName, anchor = { x: 0.5, y: 0.5 }): AnimationSprite => {
  const buffer = getSpriteBuffer(name)
  return buffer.createAnimationSprite(anchor)
}

export const getTexture = (name: SpriteName): Texture => {
  const spriteBuffer = getSpriteBuffer(name)
  assert('Default' in spriteBuffer.definitions, `'Default' is not contained in ${name}`)
  const definition = spriteBuffer.definitions['Default']
  assert(definition.textures.length === 1, 'There must be single texture for using this function')
  return definition.textures[0]
}
