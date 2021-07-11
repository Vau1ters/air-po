import { assert } from '@utils/assertion'
import { SoundInstance } from './soundInstance'
import { soundURL } from './soundURL'

export type SoundName = keyof typeof soundURL

export type PlayOptions = {
  volume: number
  pan?: number
}

let _ctx: AudioContext
const soundStore: { [key in SoundName]?: AudioBuffer } = {}

const getContext = (): AudioContext => {
  assert(_ctx !== undefined, 'sound.init is not called yet')
  return _ctx
}

export const play = (name: SoundName, options: PlayOptions = { volume: 0.1 }): SoundInstance => {
  const buffer = soundStore[name]
  assert(buffer !== undefined, name + ' is not loaded')
  const ctx = getContext()

  const source = ctx.createBufferSource()
  source.buffer = buffer

  let node: AudioNode = source

  const gainNode = ctx.createGain()
  gainNode.gain.value = options?.volume ?? 0.1
  node.connect(gainNode)
  node = gainNode

  let panNode: StereoPannerNode | undefined
  if (options?.pan !== undefined) {
    panNode = ctx.createStereoPanner()
    panNode.pan.value = options.pan
    node.connect(panNode)
    node = panNode
  }
  node.connect(ctx.destination)

  const instance = new SoundInstance(options, gainNode, panNode)

  source.start(0)
  source.onended = (): void => {
    instance.complete()
  }

  return instance
}

const load = async (url: string): Promise<AudioBuffer> => {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return await new Promise<AudioBuffer>((resolve, reject) => {
    getContext().decodeAudioData(buffer, resolve, reject)
  })
}

export const init = async (): Promise<void> => {
  _ctx = new AudioContext()

  for (const name of Object.keys(soundURL) as Array<SoundName>) {
    soundStore[name] = await load(soundURL[name])
  }
}
