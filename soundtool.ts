import * as fs from 'fs'

const fileText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT
import { assert } from '@utils/assertion'

export type PlayOptions = {
  volume?: number
  pan?: number
}

let _ctx: AudioContext
const soundStore: { [key: string]: AudioBuffer } = {}

const getContext = (): AudioContext => {
  assert(_ctx !== undefined, 'sound.init is not called yet')
  return _ctx
}

export const play = (name: string, option?: PlayOptions): void => {
  option = option ?? { volume: 0.1 }
  const buffer = soundStore[name]
  assert(buffer !== undefined, name + ' is not loaded')
  const ctx = getContext()

  const source = ctx.createBufferSource()
  source.buffer = buffer

  let node: AudioNode = source

  if (option.volume) {
    const gainNode = ctx.createGain()
    gainNode.gain.value = option.volume
    node.connect(gainNode)
    node = gainNode
  }

  if (option.pan) {
    const panNode = ctx.createStereoPanner()
    panNode.pan.value = option.pan
    node.connect(panNode)
    node = panNode
  }

  node.connect(ctx.destination)

  source.start(0)
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
  // LOAD_RESOURCE
}

`
const importText = (filename: string): string => {
  return `import ${filename} from '@res/sound/${filename}.ogg'`
}
const loadFormatText = (filename: string): string => {
  return `soundStore.${filename} = await load(${filename})`
}

const soundPath = 'res/sound'
const soundTsPath = 'src/core/sound/sound.ts'
const dir = fs.readdirSync(soundPath, { withFileTypes: true })

const importReg = new RegExp('// IMPORT')
const loadReg = new RegExp('// LOAD_RESOURCE')

console.log('File added:')
const generatedText = dir.reduce((text, file) => {
  const filename = file.name.split('.')[0]
  text = text.replace(importReg, `// IMPORT\n${importText(filename)}`)
  text = text.replace(loadReg, `// LOAD_RESOURCE\n  ${loadFormatText(filename)}`)
  console.log(file.name)
  return text
}, fileText)

fs.writeFile(soundTsPath, generatedText, err => {
  if (err) throw err
  console.log('Successfully generated soundtool.ts')
})
