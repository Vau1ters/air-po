import { Animation } from './animation'
import { Texture } from 'pixi.js'
import { textureStore } from './art'
import { checkMembers } from '@utils/assertion'

type SpriteSetting = {
  name: string
  state: { [key: string]: Array<number> }
  default: string
}

const cache: Record<string, () => Animation> = {}

export function parseAnimation(json: SpriteSetting): Animation {
  if (!cache[json.name]) {
    checkMembers(json, { name: 'string', state: 'any', default: 'string' }, 'sprite')

    const name = json.name
    if (!textureStore[name]) throw new Error(`"${name}" is not contained in textureStore`)

    const state: { [key: string]: number[] } = json.state

    const defaultState = json['default']
    if (!state[defaultState]) throw new Error(`"${defaultState}" is not contained in state`)

    const textures = textureStore[name]
    const animatedTexture: { [key: string]: Array<Texture> } = {}
    for (const stateName of Object.keys(state)) {
      const indices = state[stateName]
      animatedTexture[stateName] = indices.map(i => textures[i])
    }
    cache[name] = (): Animation => new Animation(animatedTexture, defaultState)
  }
  return cache[json.name]()
}
