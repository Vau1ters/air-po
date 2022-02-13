import { assert } from '@utils/assertion'
import { SoundInstance } from './soundInstance'
import { soundURL } from './soundURL'

export type SoundName = keyof typeof soundURL

export const toSoundName = (s: string): SoundName => {
  assert(s in soundURL, `'${s} is not SoundName`)
  return s as SoundName
}

export type PlayOptions = {
  pan?: number
  volume?: number
}

type SoundBuffer = {
  audioBuffer: AudioBuffer
  maxVolume: number
  loop?: {
    start: number
    end: number
  }
}

const ctx = new AudioContext()
const soundStore: { [key in SoundName]?: SoundBuffer } = {}
const globalGainNode = ctx.createGain()

export const play = (name: SoundName, options: PlayOptions = {}): SoundInstance => {
  const buffer = soundStore[name]
  assert(buffer !== undefined, name + ' is not loaded')

  const source = ctx.createBufferSource()
  source.buffer = buffer.audioBuffer

  if (buffer.loop) {
    source.loop = true
    source.loopStart = buffer.loop.start
    source.loopEnd = buffer.loop.end
  } else {
    source.loop = false
  }

  let node: AudioNode = source

  const gainNode = ctx.createGain()
  gainNode.gain.value = buffer.maxVolume * (options.volume ?? 1)
  node.connect(gainNode)
  node = gainNode

  let panNode: StereoPannerNode | undefined
  if (options?.pan !== undefined) {
    panNode = ctx.createStereoPanner()
    panNode.pan.value = options.pan
    node.connect(panNode)
    node = panNode
  }
  node.connect(globalGainNode)

  const instance = new SoundInstance(buffer.maxVolume, source, gainNode, panNode)

  source.start(0)
  source.onended = (): void => {
    instance.complete()
  }

  return instance
}

const load = async (path: string): Promise<AudioBuffer> => {
  const { default: url } = require(`/res/sound/${path}`) // eslint-disable-line  @typescript-eslint/no-var-requires
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return await new Promise<AudioBuffer>((resolve, reject) => {
    ctx.decodeAudioData(buffer, resolve, reject)
  })
}

export const init = async (): Promise<void> => {
  for (const name of Object.keys(soundURL) as Array<SoundName>) {
    const sound = soundURL[name]
    const audioBuffer = await load(sound.path)
    soundStore[name] = {
      audioBuffer,
      maxVolume: sound.maxVolume,
      loop: sound.loop,
    }
  }
  globalGainNode.connect(ctx.destination)
}

export const setMasterVolume = (volume: number): void => {
  globalGainNode.gain.value = volume
}
