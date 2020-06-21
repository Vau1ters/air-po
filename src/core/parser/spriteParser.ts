import { Animation } from '../graphics/animation'
import { Texture } from 'pixi.js'
import { textureStore } from '../graphics/art'
import { checkMembers } from '../../utils/assertion'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

export function parseSprite(json: any): Animation {
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
