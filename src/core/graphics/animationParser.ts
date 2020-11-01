import { Animation } from './animation'
import { Texture } from 'pixi.js'
import { textureStore } from './art'
import { checkMembers } from '../../utils/assertion'

type SpriteSetting = {
  name: string
  state: { [key: string]: Array<number> }
  default: string
}

export function parseSprite(json: SpriteSetting): Animation {
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
  return new Animation(animatedTexture, defaultState)
}
