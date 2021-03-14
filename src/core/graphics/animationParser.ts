import { AnimationSprite, AnimationDefinition } from './animation'
import { textureStore } from './art'
import { checkMembers } from '@utils/assertion'

type SpriteSetting = {
  name: string
  state: { [key: string]: Array<number> }
  speed: { [key: string]: number }
  default: string
}

const cache: Record<string, () => AnimationSprite> = {}

export function parseAnimation(json: SpriteSetting): AnimationSprite {
  if (!cache[json.name]) {
    checkMembers(json, { name: 'string', state: 'any', speed: 'any', default: 'string' }, 'sprite')

    const name = json.name
    if (!textureStore[name]) throw new Error(`"${name}" is not contained in textureStore`)

    const state: { [key: string]: number[] } = json.state
    const speed: { [key: string]: number } = json.speed

    const defaultState = json.default
    if (!state[defaultState]) throw new Error(`"${defaultState}" is not contained in state`)

    const textures = textureStore[name]
    const animatedTexture: AnimationDefinition = {}
    for (const stateName of Object.keys(state)) {
      const indices = state[stateName]
      animatedTexture[stateName] = {
        textures: indices.map(i => textures[i]),
        waitFrames: speed[stateName],
      }
    }
    cache[name] = (): AnimationSprite => new AnimationSprite(animatedTexture, defaultState)
  }
  return cache[json.name]()
}
