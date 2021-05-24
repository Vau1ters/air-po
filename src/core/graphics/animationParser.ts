import { AnimationSprite, AnimationDefinition } from './animation'
import { textureStore } from './art'
import { assert } from '@utils/assertion'

export type AnimationSetting = {
  name: string
  animation?: {
    state: { [key: string]: Array<number> }
    speed?: { [key: string]: number }
    default: string
  }
}

// 一枚絵をアニメーションとして扱うための設定
const DEFAULT_ANIMATION_SETTING = {
  state: { Default: [0] },
  speed: {},
  default: 'Default',
}

const cache: Record<string, () => AnimationSprite> = {}

export const parseAnimation = (
  json: AnimationSetting,
  anchor = { x: 0.5, y: 0.5 }
): AnimationSprite => {
  if (!cache[json.name]) {
    const animationSetting = json.animation ?? DEFAULT_ANIMATION_SETTING

    const name = json.name
    assert(textureStore[name], `"${name}" is not contained in textureStore`)

    const state: { [key: string]: number[] } = animationSetting.state
    const speed: { [key: string]: number } = animationSetting.speed ?? {}

    const defaultState = animationSetting.default
    assert(state[defaultState], `"${defaultState}" is not contained in state`)

    const textures = textureStore[name]
    const animatedTexture: AnimationDefinition = {}
    for (const stateName of Object.keys(state)) {
      const indices = state[stateName]
      animatedTexture[stateName] = {
        textures: indices.map(i => textures[i]),
        waitFrames: speed[stateName],
      }
    }
    cache[name] = (): AnimationSprite => new AnimationSprite(animatedTexture, defaultState, anchor)
  }
  return cache[json.name]()
}
