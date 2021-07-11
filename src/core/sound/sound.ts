import { assert } from '@utils/assertion'
import { SoundInstance } from './soundInstance'
import { AllSoundName, getSoundURL, SoundName } from './soundStore'

export type PlayOptions = {
  volume?: number
  pan?: number
  oncomplete?: () => void
}

let _ctx: AudioContext
const soundStore: { [key in SoundName]?: AudioBuffer } = {}

const getContext = (): AudioContext => {
  assert(_ctx !== undefined, 'sound.init is not called yet')
  return _ctx
}

export const play = (name: SoundName, option?: PlayOptions): SoundInstance => {
  const buffer = soundStore[name]
  assert(buffer !== undefined, name + ' is not loaded')
  const ctx = getContext()

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.start(0)
  source.onended = option?.oncomplete ?? null

  let node: AudioNode = source

  const gainNode = ctx.createGain()
  gainNode.gain.value = option?.volume ?? 0.1
  node.connect(gainNode)
  node = gainNode

  if (option?.pan !== undefined) {
    const panNode = ctx.createStereoPanner()
    panNode.pan.value = option.pan
    node.connect(panNode)
    node = panNode
    node.connect(ctx.destination)
    return new SoundInstance(gainNode, panNode)
  } else {
    node.connect(ctx.destination)
    return new SoundInstance(gainNode)
  }
}

const load = (url: string): Promise<AudioBuffer> => {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'

    xhr.onload = (): void => {
      const ctx = getContext()
      ctx.decodeAudioData(xhr.response, resolve, reject)
    }
    xhr.send()
  })
}

export const init = async (): Promise<void> => {
  _ctx = new AudioContext()

  for (const name of AllSoundName) {
    soundStore[name] = await load(getSoundURL(name))
  }
}
